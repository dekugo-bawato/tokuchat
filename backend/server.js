const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const multer = require('multer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

const PORT = process.env.PORT || 3000;

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'Toku_secret_2024',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000, name: 'toku_session' }
}));

// ============================================================
// STATIC FILES
// ============================================================
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ============================================================
// MULTER SETUP
// ============================================================
const uploadDir = path.join(__dirname, '..', 'frontend', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        let prefix = 'file-';
        if (req.path.includes('avatar')) {
            prefix = 'avatar-';
        } else if (req.path.includes('image')) {
            prefix = 'img-';
        }
        cb(null, prefix + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ hỗ trợ ảnh (JPEG, PNG, GIF, WEBP)'), false);
        }
    }
});

// ============================================================
// DATABASE FUNCTIONS
// ============================================================
const DB_FILE = path.join(__dirname, 'users.json');

function getUsers() {
    try {
        if (fs.existsSync(DB_FILE)) {
            return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        }
        return [];
    } catch { return []; }
}

function saveUsers(users) {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

function findUserByUsername(username) {
    const users = getUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase().trim());
}

function findUserByEmail(email) {
    const users = getUsers();
    return users.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
}

function updateUser(username, data) {
    const users = getUsers();
    const idx = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase().trim());
    if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        saveUsers(users);
        return users[idx];
    }
    return null;
}

function createUser(userData) {
    const users = getUsers();
    const newUser = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user',
        tier: userData.tier || 'user',
        tierExpiry: userData.tierExpiry || null,
        displayName: userData.displayName || userData.username,
        effects: userData.effects || [],
        cash: userData.cash || 0,
        totalTopup: userData.totalTopup || 0,
        badges: userData.badges || [],
        themes: userData.themes || ['default', 'theme7'],
        currentTheme: userData.currentTheme || 'default',
        refreshTokens: userData.refreshTokens || 0,
        lastRefreshTokenTime: userData.lastRefreshTokenTime || Date.now(),
        currentBadge: userData.currentBadge || null,
        frames: userData.frames || ['default'],
        currentFrame: userData.currentFrame || 'default',
        gradientText: userData.gradientText || false,
        typingEffect: userData.typingEffect || false,
        avatarFrames: userData.avatarFrames || ['default'],
        currentAvatarFrame: userData.currentAvatarFrame || 'default',
        highlightedName: userData.highlightedName || false,
        avatarUrl: userData.avatarUrl || null,
        msgColor: userData.msgColor || '#6C2BD9',
        createdAt: new Date().toISOString(),
        // VIP
        vipExpiry: userData.vipExpiry || null,
        vipActive: userData.vipActive || false,
        vipLastClaimDate: userData.vipLastClaimDate || null,
        // Season Pass
        seasonTier: 0,
        seasonExp: 0,
        seasonMaxExp: 100,
        seasonIsElite: false,
        seasonClaimedRewards: [],
        seasonClaimedElite: [],
        seasonMissions: {},
        seasonLastReset: new Date().toISOString(),
        seasonStartDate: new Date().toISOString(),
        seasonEffectsExpiry: {},
        // Birthday
        birthdayClaimed: false,
        birthdayYear: new Date().getFullYear(),
        // Achievements
        achievements: {},
        // Flash Sale
        flashSaleSelected: [],
        flashSaleActive: false,
        flashSaleExpiry: 0
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
}

// ============================================================
// NOTIFICATIONS SYSTEM
// ============================================================
const NOTIFICATIONS_FILE = path.join(__dirname, 'notifications.json');

function getNotifications(username) {
    try {
        if (fs.existsSync(NOTIFICATIONS_FILE)) {
            const all = JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, 'utf8'));
            return all[username] || [];
        }
        return [];
    } catch { return []; }
}

function saveNotifications(username, notifications) {
    try {
        let all = {};
        if (fs.existsSync(NOTIFICATIONS_FILE)) {
            all = JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, 'utf8'));
        }
        all[username] = notifications;
        fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(all, null, 2));
        return true;
    } catch (e) {
        console.error('Save notifications error:', e);
        return false;
    }
}

function addNotification(username, type, data) {
    try {
        let notifications = getNotifications(username);
        
        const newNotif = {
            id: Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            type: type,
            data: data,
            read: false,
            createdAt: new Date().toISOString()
        };
        
        notifications.unshift(newNotif);
        if (notifications.length > 100) {
            notifications = notifications.slice(0, 100);
        }
        
        saveNotifications(username, notifications);
        
        const socketId = userSockets[username];
        if (socketId) {
            io.to(socketId).emit('new-notification', newNotif);
            io.to(socketId).emit('notification-count', getUnreadCount(username));
        }
        
        return newNotif;
    } catch (e) {
        console.error('Add notification error:', e);
        return null;
    }
}

function markNotificationRead(username, notificationId) {
    try {
        let notifications = getNotifications(username);
        const idx = notifications.findIndex(n => n.id === notificationId);
        if (idx !== -1) {
            notifications[idx].read = true;
            saveNotifications(username, notifications);
            
            const socketId = userSockets[username];
            if (socketId) {
                io.to(socketId).emit('notification-count', getUnreadCount(username));
            }
            return true;
        }
        return false;
    } catch (e) {
        console.error('Mark notification read error:', e);
        return false;
    }
}

function markAllNotificationsRead(username) {
    try {
        let notifications = getNotifications(username);
        notifications.forEach(n => n.read = true);
        saveNotifications(username, notifications);
        
        const socketId = userSockets[username];
        if (socketId) {
            io.to(socketId).emit('notification-count', 0);
        }
        return true;
    } catch (e) {
        console.error('Mark all notifications read error:', e);
        return false;
    }
}

function getUnreadCount(username) {
    try {
        const notifications = getNotifications(username);
        return notifications.filter(n => !n.read).length;
    } catch { return 0; }
}

// ============================================================
// ROLE FUNCTIONS
// ============================================================
const ROLE_HIERARCHY = {
    'owner': 4,
    'admin': 3,
    'manager': 2,
    'support': 1,
    'user': 0
};

function getRoleLevel(role) {
    return ROLE_HIERARCHY[role] || 0;
}

function isOwner(user) {
    return user && user.role === 'owner';
}

function canManageUsers(user) {
    return user && (user.role === 'support' || user.role === 'manager' || user.role === 'admin' || user.role === 'owner');
}

// ============================================================
// FRIENDS & GROUPS
// ============================================================
const FRIENDS_FILE = path.join(__dirname, 'friendships.json');
const REQUESTS_FILE = path.join(__dirname, 'friend_requests.json');
const GROUPS_FILE = path.join(__dirname, 'groups.json');
const GROUP_MEMBERS_FILE = path.join(__dirname, 'group_members.json');
const GROUP_MUTES_FILE = path.join(__dirname, 'group_mutes.json');
const GROUP_BANS_FILE = path.join(__dirname, 'group_bans.json');

function getFriendships() {
    try { return JSON.parse(fs.readFileSync(FRIENDS_FILE, 'utf8')); } catch { return []; }
}

function saveFriendships(data) {
    fs.writeFileSync(FRIENDS_FILE, JSON.stringify(data, null, 2));
}

function getFriendRequests() {
    try { return JSON.parse(fs.readFileSync(REQUESTS_FILE, 'utf8')); } catch { return []; }
}

function saveFriendRequests(data) {
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify(data, null, 2));
}

function getGroups() {
    try { return JSON.parse(fs.readFileSync(GROUPS_FILE, 'utf8')); } catch { return []; }
}

function saveGroups(data) {
    fs.writeFileSync(GROUPS_FILE, JSON.stringify(data, null, 2));
}

function getGroupMembers() {
    try { return JSON.parse(fs.readFileSync(GROUP_MEMBERS_FILE, 'utf8')); } catch { return []; }
}

function saveGroupMembers(data) {
    fs.writeFileSync(GROUP_MEMBERS_FILE, JSON.stringify(data, null, 2));
}

function getGroupMutes() {
    try { return JSON.parse(fs.readFileSync(GROUP_MUTES_FILE, 'utf8')); } catch { return {}; }
}

function saveGroupMutes(data) {
    fs.writeFileSync(GROUP_MUTES_FILE, JSON.stringify(data, null, 2));
}

function getGroupBans() {
    try { return JSON.parse(fs.readFileSync(GROUP_BANS_FILE, 'utf8')); } catch { return {}; }
}

function saveGroupBans(data) {
    fs.writeFileSync(GROUP_BANS_FILE, JSON.stringify(data, null, 2));
}

function getFriends(username) {
    const friendships = getFriendships();
    return friendships
        .filter(f => f.status === 'accepted' && (f.user1 === username || f.user2 === username))
        .map(f => f.user1 === username ? f.user2 : f.user1);
}

function getPendingRequests(username) {
    return getFriendRequests().filter(r => r.to === username && r.status === 'pending');
}

// ============================================================
// GROUP MUTE/BAN FUNCTIONS
// ============================================================
function isUserMuted(groupId, username) {
    const mutes = getGroupMutes();
    return mutes[groupId] && mutes[groupId].includes(username);
}

function isUserBanned(groupId, username) {
    const bans = getGroupBans();
    return bans[groupId] && bans[groupId].includes(username);
}

function addMute(groupId, username) {
    const mutes = getGroupMutes();
    if (!mutes[groupId]) mutes[groupId] = [];
    if (!mutes[groupId].includes(username)) {
        mutes[groupId].push(username);
        saveGroupMutes(mutes);
        return true;
    }
    return false;
}

function removeMute(groupId, username) {
    const mutes = getGroupMutes();
    if (mutes[groupId]) {
        mutes[groupId] = mutes[groupId].filter(u => u !== username);
        if (mutes[groupId].length === 0) delete mutes[groupId];
        saveGroupMutes(mutes);
        return true;
    }
    return false;
}

function addBan(groupId, username) {
    const bans = getGroupBans();
    if (!bans[groupId]) bans[groupId] = [];
    if (!bans[groupId].includes(username)) {
        bans[groupId].push(username);
        saveGroupBans(bans);
        return true;
    }
    return false;
}

function removeBan(groupId, username) {
    const bans = getGroupBans();
    if (bans[groupId]) {
        bans[groupId] = bans[groupId].filter(u => u !== username);
        if (bans[groupId].length === 0) delete bans[groupId];
        saveGroupBans(bans);
        return true;
    }
    return false;
}

function getGroupOwner(groupId) {
    const groups = getGroups();
    const group = groups.find(g => g.id === groupId);
    return group ? group.createdBy : null;
}

// ============================================================
// CHAT CHUNG
// ============================================================
function initializeChatChung() {
    const groups = getGroups();
    const chatChung = groups.find(g => g.id === 'chat_chung');
    if (!chatChung) {
        const newGroup = {
            id: 'chat_chung',
            name: '💬 Chat Chung',
            createdBy: 'system',
            createdAt: new Date().toISOString(),
            avatar: '💬',
            isPermanent: true
        };
        groups.push(newGroup);
        saveGroups(groups);
        console.log('✅ Đã tạo nhóm Chat Chung');
    }
    
    const users = getUsers();
    const members = getGroupMembers();
    let updated = false;
    users.forEach(user => {
        if (!members.some(m => m.groupId === 'chat_chung' && m.userId === user.username)) {
            members.push({
                groupId: 'chat_chung',
                userId: user.username,
                role: 'member',
                joinedAt: new Date().toISOString()
            });
            updated = true;
        }
    });
    if (updated) {
        saveGroupMembers(members);
        console.log('✅ Đã thêm tất cả user vào Chat Chung');
    }
}

function addUserToChatChung(username) {
    const members = getGroupMembers();
    if (!members.some(m => m.groupId === 'chat_chung' && m.userId === username)) {
        members.push({
            groupId: 'chat_chung',
            userId: username,
            role: 'member',
            joinedAt: new Date().toISOString()
        });
        saveGroupMembers(members);
        console.log(`✅ Đã thêm ${username} vào Chat Chung`);
    }
}

// ============================================================
// MESSAGES
// ============================================================
const MESSAGES_DIR = path.join(__dirname, 'messages');
if (!fs.existsSync(MESSAGES_DIR)) fs.mkdirSync(MESSAGES_DIR);

function loadMessages(chatId) {
    const filePath = path.join(MESSAGES_DIR, `${chatId}.json`);
    if (fs.existsSync(filePath)) {
        try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { return []; }
    }
    return [];
}

function saveMessages(chatId, messages) {
    fs.writeFileSync(path.join(MESSAGES_DIR, `${chatId}.json`), JSON.stringify(messages, null, 2));
}

function addMessage(chatId, msg) {
    const messages = loadMessages(chatId);
    messages.push(msg);
    saveMessages(chatId, messages);
    return messages;
}

// ============================================================
// BADGES
// ============================================================
function updateBadges(username) {
    const user = findUserByUsername(username);
    if (!user) return;
    
    const friends = getFriends(username);
    const effects = user.effects || [];
    const cash = user.cash || 0;
    const totalTopup = user.totalTopup || 0;
    const badges = user.badges || [];
    const newBadges = [];

    if (friends.length >= 3 && !badges.includes('Người kết nối')) newBadges.push('Người kết nối');
    if (effects.length >= 5 && !badges.includes('Nhà sưu tập')) newBadges.push('Nhà sưu tập');
    if (user.tier === 'bronze' && !badges.includes('Đồng')) newBadges.push('Đồng');
    if (user.tier === 'silver' && !badges.includes('Bạc')) newBadges.push('Bạc');
    if (user.tier === 'gold' && !badges.includes('Vàng')) newBadges.push('Vàng');
    if (user.tier === 'platinum' && !badges.includes('Bạch kim')) newBadges.push('Bạch kim');
    if (user.tier === 'diamond' && !badges.includes('Kim cương')) newBadges.push('Kim cương');
    if (user.tier === 'vip' && !badges.includes('VIP')) newBadges.push('VIP');
    if (user.tier === 'legend' && !badges.includes('Huyền thoại')) newBadges.push('Huyền thoại');
    if (cash >= 100000 && !badges.includes('Nhà giàu')) newBadges.push('Nhà giàu');
    if (cash >= 500000 && !badges.includes('Đại gia')) newBadges.push('Đại gia');
    if (totalTopup >= 30000 && !badges.includes('Nạp thử')) newBadges.push('Nạp thử');
    if (totalTopup >= 70000 && !badges.includes('Nạp nhiều')) newBadges.push('Nạp nhiều');

    if (newBadges.length > 0) {
        const updatedBadges = [...badges, ...newBadges];
        updateUser(username, { badges: updatedBadges });
    }
}

// ============================================================
// ACHIEVEMENTS
// ============================================================
const ACHIEVEMENTS_DEF = {
    'first_purchase': { name: 'Người mua đầu tiên', desc: 'Mua item đầu tiên', icon: '🛒', target: 1, type: 'purchase' },
    'collector_5': { name: 'Nhà sưu tập cấp 1', desc: 'Sở hữu 5 item', icon: '📦', target: 5, type: 'collect' },
    'collector_10': { name: 'Nhà sưu tập cấp 2', desc: 'Sở hữu 10 item', icon: '📦', target: 10, type: 'collect' },
    'collector_20': { name: 'Nhà sưu tập cấp 3', desc: 'Sở hữu 20 item', icon: '📦', target: 20, type: 'collect' },
    'rich_100k': { name: 'Nhà giàu', desc: 'Có 100,000 💵', icon: '💰', target: 100000, type: 'cash' },
    'rich_500k': { name: 'Đại gia', desc: 'Có 500,000 💵', icon: '💰', target: 500000, type: 'cash' },
    'rich_1m': { name: 'Tỷ phú', desc: 'Có 1,000,000 💵', icon: '💰', target: 1000000, type: 'cash' },
    'rank_bronze': { name: 'Rank Đồng', desc: 'Đạt rank Đồng', icon: '🥉', target: 1, type: 'rank' },
    'rank_silver': { name: 'Rank Bạc', desc: 'Đạt rank Bạc', icon: '🥈', target: 1, type: 'rank' },
    'rank_gold': { name: 'Rank Vàng', desc: 'Đạt rank Vàng', icon: '🥇', target: 1, type: 'rank' },
    'rank_platinum': { name: 'Rank Bạch kim', desc: 'Đạt rank Bạch kim', icon: '💎', target: 1, type: 'rank' },
    'rank_diamond': { name: 'Rank Kim cương', desc: 'Đạt rank Kim cương', icon: '💠', target: 1, type: 'rank' },
    'rank_vip': { name: 'Rank VIP', desc: 'Đạt rank VIP', icon: '👑', target: 1, type: 'rank' },
    'rank_legend': { name: 'Rank Huyền thoại', desc: 'Đạt rank Huyền thoại', icon: '🌟', target: 1, type: 'rank' },
    'effects_3': { name: 'Nhà ảo thuật', desc: 'Sở hữu 3 hiệu ứng', icon: '✨', target: 3, type: 'effect' },
    'effects_5': { name: 'Phù thủy', desc: 'Sở hữu 5 hiệu ứng', icon: '🧙', target: 5, type: 'effect' },
    'frames_3': { name: 'Người trang trí', desc: 'Sở hữu 3 frame', icon: '🖼️', target: 3, type: 'frame' },
    'frames_5': { name: 'Nhà thiết kế', desc: 'Sở hữu 5 frame', icon: '🎨', target: 5, type: 'frame' },
    'avatar_frames_3': { name: 'Người sành điệu', desc: 'Sở hữu 3 khung avatar', icon: '👤', target: 3, type: 'avatarframe' },
    'season_10': { name: 'Chiến binh mùa', desc: 'Đạt cấp 10 Season Pass', icon: '⚔️', target: 10, type: 'season' },
    'season_25': { name: 'Thợ săn', desc: 'Đạt cấp 25 Season Pass', icon: '🏹', target: 25, type: 'season' },
    'season_50': { name: 'Huyền thoại mùa', desc: 'Đạt cấp 50 Season Pass', icon: '👑', target: 50, type: 'season' },
    'vip_subscriber': { name: 'VIP', desc: 'Đăng ký VIP', icon: '👑', target: 1, type: 'vip' },
    'birthday_claimed': { name: '🎂 Sinh nhật', desc: 'Nhận quà sinh nhật', icon: '🎂', target: 1, type: 'birthday' },
    'friend_3': { name: 'Người kết nối', desc: 'Có 3 bạn bè', icon: '🤝', target: 3, type: 'friend' },
    'friend_10': { name: 'Người nổi tiếng', desc: 'Có 10 bạn bè', icon: '🌟', target: 10, type: 'friend' }
};

function checkAndUnlockAchievements(username) {
    const user = findUserByUsername(username);
    if (!user) return;
    
    const achievements = user.achievements || {};
    let unlocked = false;
    
    Object.entries(ACHIEVEMENTS_DEF).forEach(([id, def]) => {
        if (achievements[id]) return;
        
        let progress = 0;
        switch (def.type) {
            case 'collect':
                const totalItems = (user.effects || []).length + 
                                 (user.themes || []).length + 
                                 (user.frames || []).length + 
                                 (user.avatarFrames || []).length;
                progress = totalItems;
                break;
            case 'cash':
                progress = user.cash || 0;
                break;
            case 'rank':
                const ranks = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'vip', 'legend'];
                progress = ranks.indexOf(user.tier || 'user') + 1;
                break;
            case 'effect':
                progress = (user.effects || []).length;
                break;
            case 'frame':
                progress = (user.frames || []).length;
                break;
            case 'avatarframe':
                progress = (user.avatarFrames || []).length;
                break;
            case 'season':
                progress = user.seasonTier || 0;
                break;
            case 'vip':
                progress = (user.vipExpiry && new Date(user.vipExpiry) > new Date()) ? 1 : 0;
                break;
            case 'birthday':
                progress = user.birthdayClaimed ? 1 : 0;
                break;
            case 'friend':
                progress = getFriends(username).length;
                break;
            default:
                progress = 0;
        }
        
        if (progress >= def.target) {
            achievements[id] = true;
            unlocked = true;
            
            const socketId = userSockets[username];
            if (socketId) {
                io.to(socketId).emit('achievement-unlocked', {
                    username: username,
                    id: id,
                    name: def.name,
                    icon: def.icon
                });
            }
            
            addNotification(username, 'achievement', {
                name: def.name,
                icon: def.icon,
                message: `🏆 Đã mở khóa thành tựu: ${def.name}`
            });
        }
    });
    
    if (unlocked) {
        updateUser(username, { achievements });
    }
}

// ============================================================
// UPLOAD ROUTES
// ============================================================
app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, msg: 'Không có file ảnh.' });
        }
        const avatarUrl = `/uploads/${req.file.filename}`;
        const { username } = req.body;
        
        if (username) {
            const updatedUser = updateUser(username, { avatarUrl });
            if (req.session && req.session.user && req.session.user.username === username) {
                req.session.user.avatarUrl = avatarUrl;
            }
            io.emit('user-updated', { 
                username, 
                type: 'avatar', 
                avatarUrl,
                fullUser: updatedUser,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
        }
        
        res.json({ success: true, avatarUrl, msg: 'Cập nhật avatar thành công!' });
    } catch (e) {
        console.error('Upload avatar error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi upload avatar: ' + e.message });
    }
});

app.post('/api/upload-image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, msg: 'Không có file ảnh.' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ success: true, imageUrl, msg: 'Tải ảnh lên thành công!' });
    } catch (e) {
        console.error('Upload image error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi upload ảnh: ' + e.message });
    }
});

// ============================================================
// AUTH ROUTES
// ============================================================
app.post('/api/register', (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        console.log('📝 Đăng ký:', username, email);
        
        if (!username || username.length < 3) {
            return res.status(400).json({ success: false, msg: 'Tên đăng nhập tối thiểu 3 ký tự.' });
        }
        if (!email) {
            return res.status(400).json({ success: false, msg: 'Vui lòng nhập email.' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, msg: 'Mật khẩu tối thiểu 6 ký tự.' });
        }
        
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(email)) {
            return res.status(400).json({ success: false, msg: 'Email không hợp lệ.' });
        }
        
        if (findUserByUsername(username)) {
            return res.status(400).json({ success: false, msg: 'Tên đăng nhập đã tồn tại.' });
        }
        if (findUserByEmail(email)) {
            return res.status(400).json({ success: false, msg: 'Email đã được đăng ký.' });
        }
        
        const OWNER_EMAIL = 'nguyenvietnamtthsp@gmail.com';
        let role = 'user';
        let tier = 'user';
        let isOwnerUser = false;
        
        if (email.toLowerCase().trim() === OWNER_EMAIL.toLowerCase().trim()) {
            role = 'owner';
            tier = 'legend';
            isOwnerUser = true;
        }
        
        const newUser = createUser({
            username: username.trim(),
            email: email.trim(),
            password,
            role,
            tier,
            displayName: username.trim(),
            effects: isOwnerUser ? ['twinkle','shimmer','glow','bubble','explode','rainbow','fire','dragon','aurora','starlight','galaxy'] : [],
            cash: isOwnerUser ? 10000000 : 0,
            totalTopup: isOwnerUser ? 10000000 : 0,
            badges: isOwnerUser ? ['Người kết nối','Nhà sưu tập','Nhà phát tài','Đại gia','Huyền thoại'] : [],
            themes: isOwnerUser ? ['default','theme1','theme2','theme3','theme4','theme5','theme6','theme7'] : ['default', 'theme7'],
            refreshTokens: isOwnerUser ? 999 : 0,
            currentBadge: isOwnerUser ? 'Huyền thoại' : null,
            frames: isOwnerUser ? ['default','frame1','frame2','frame3','frame4','frame5','frame6','frame7'] : ['default'],
            gradientText: isOwnerUser ? true : false,
            typingEffect: isOwnerUser ? true : false,
            avatarFrames: isOwnerUser ? ['default','avtframe1','avtframe2','avtframe3','avtframe4','avtframe5','avtframe6'] : ['default'],
            highlightedName: isOwnerUser ? true : false,
            avatarUrl: null,
            msgColor: isOwnerUser ? '#ff6b6b' : '#6C2BD9',
            vipExpiry: isOwnerUser ? new Date(Date.now() + 365*24*60*60*1000).toISOString() : null,
            vipActive: isOwnerUser ? true : false
        });
        
        addUserToChatChung(newUser.username);
        
        req.session.user = {
            username: newUser.username,
            email: newUser.email,
            role: newUser.role || 'user',
            tier: newUser.tier,
            tierExpiry: newUser.tierExpiry || null,
            displayName: newUser.displayName,
            effects: newUser.effects || [],
            cash: newUser.cash || 0,
            totalTopup: newUser.totalTopup || 0,
            badges: newUser.badges || [],
            themes: newUser.themes || [],
            refreshTokens: newUser.refreshTokens || 0,
            currentBadge: newUser.currentBadge || null,
            frames: newUser.frames || ['default'],
            currentFrame: newUser.currentFrame || 'default',
            gradientText: newUser.gradientText || false,
            typingEffect: newUser.typingEffect || false,
            avatarFrames: newUser.avatarFrames || ['default'],
            currentAvatarFrame: newUser.currentAvatarFrame || 'default',
            highlightedName: newUser.highlightedName || false,
            avatarUrl: newUser.avatarUrl || null,
            msgColor: newUser.msgColor || '#6C2BD9',
            seasonTier: 0,
            seasonExp: 0,
            seasonMaxExp: 100,
            seasonIsElite: false,
            seasonClaimedRewards: [],
            seasonClaimedElite: [],
            vipExpiry: newUser.vipExpiry || null,
            vipActive: newUser.vipActive || false
        };
        
        console.log('✅ Đăng ký thành công:', username);
        
        res.json({
            success: true,
            msg: 'Đăng ký thành công!',
            user: req.session.user
        });
    } catch (e) {
        console.error('Register error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi đăng ký: ' + e.message });
    }
});

app.post('/api/login', (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        
        console.log('🔐 Đăng nhập:', usernameOrEmail);
        
        if (!usernameOrEmail || !password) {
            return res.status(400).json({ success: false, msg: 'Vui lòng nhập đầy đủ thông tin.' });
        }
        
        let user = findUserByUsername(usernameOrEmail);
        if (!user) user = findUserByEmail(usernameOrEmail);
        
        if (!user) {
            console.log('❌ Không tìm thấy user:', usernameOrEmail);
            return res.status(404).json({ success: false, msg: 'Tài khoản không tồn tại.' });
        }
        
        console.log('✅ Tìm thấy user:', user.username, 'Role:', user.role);
        
        if (user.password !== password) {
            console.log('❌ Sai mật khẩu cho:', usernameOrEmail);
            return res.status(401).json({ success: false, msg: 'Mật khẩu sai. Vui lòng thử lại.' });
        }
        
        // Auto add refresh tokens
        const now = Date.now();
        const elapsed = now - (user.lastRefreshTokenTime || now);
        const hours = elapsed / (3 * 60 * 60 * 1000);
        if (hours >= 1) {
            const tokensToAdd = Math.floor(hours);
            const newTokens = (user.refreshTokens || 0) + tokensToAdd;
            const newLastTime = now - ((hours - tokensToAdd) * 3 * 60 * 60 * 1000);
            user = updateUser(user.username, { refreshTokens: newTokens, lastRefreshTokenTime: newLastTime });
        }
        
        // Initialize season data if not exists
        if (user.seasonTier === undefined) {
            user = updateUser(user.username, {
                seasonTier: 0,
                seasonExp: 0,
                seasonMaxExp: 100,
                seasonIsElite: false,
                seasonClaimedRewards: [],
                seasonClaimedElite: [],
                seasonMissions: {},
                seasonLastReset: new Date().toISOString()
            });
        }
        
        // Initialize VIP if not exists
        if (user.vipExpiry === undefined) {
            user = updateUser(user.username, {
                vipExpiry: null,
                vipActive: false,
                vipLastClaimDate: null
            });
        }
        
        // Check VIP expiry
        let vipActive = user.vipActive || false;
        if (user.vipExpiry && new Date(user.vipExpiry) <= new Date()) {
            vipActive = false;
            user = updateUser(user.username, { vipActive: false });
        }
        
        req.session.user = {
            username: user.username,
            email: user.email,
            role: user.role || 'user',
            tier: user.tier || 'user',
            tierExpiry: user.tierExpiry || null,
            displayName: user.displayName || user.username,
            effects: user.effects || [],
            cash: user.cash || 0,
            totalTopup: user.totalTopup || 0,
            badges: user.badges || [],
            themes: user.themes || [],
            refreshTokens: user.refreshTokens || 0,
            currentBadge: user.currentBadge || null,
            frames: user.frames || ['default'],
            currentFrame: user.currentFrame || 'default',
            gradientText: user.gradientText || false,
            typingEffect: user.typingEffect || false,
            avatarFrames: user.avatarFrames || ['default'],
            currentAvatarFrame: user.currentAvatarFrame || 'default',
            highlightedName: user.highlightedName || false,
            avatarUrl: user.avatarUrl || null,
            msgColor: user.msgColor || '#6C2BD9',
            seasonTier: user.seasonTier || 0,
            seasonExp: user.seasonExp || 0,
            seasonMaxExp: user.seasonMaxExp || 100,
            seasonIsElite: user.seasonIsElite || false,
            seasonClaimedRewards: user.seasonClaimedRewards || [],
            seasonClaimedElite: user.seasonClaimedElite || [],
            vipExpiry: user.vipExpiry || null,
            vipActive: vipActive,
            vipLastClaimDate: user.vipLastClaimDate || null
        };
        
        console.log('✅ Đăng nhập thành công:', user.username, 'Role:', user.role);
        
        checkAndUnlockAchievements(user.username);
        
        res.json({
            success: true,
            msg: 'Đăng nhập thành công!',
            user: req.session.user
        });
    } catch (e) {
        console.error('Login error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi đăng nhập: ' + e.message });
    }
});

app.get('/api/session', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.post('/api/refresh-session', (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ success: false, msg: 'Chưa đăng nhập' });
        }
        
        const username = req.session.user.username;
        const user = findUserByUsername(username);
        
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }
        
        // Check VIP expiry
        let vipActive = user.vipActive || false;
        if (user.vipExpiry && new Date(user.vipExpiry) <= new Date()) {
            vipActive = false;
            updateUser(username, { vipActive: false });
        }
        
        req.session.user = {
            username: user.username,
            email: user.email,
            role: user.role || 'user',
            tier: user.tier || 'user',
            tierExpiry: user.tierExpiry || null,
            displayName: user.displayName || user.username,
            effects: user.effects || [],
            cash: user.cash || 0,
            totalTopup: user.totalTopup || 0,
            badges: user.badges || [],
            themes: user.themes || [],
            refreshTokens: user.refreshTokens || 0,
            currentBadge: user.currentBadge || null,
            frames: user.frames || ['default'],
            currentFrame: user.currentFrame || 'default',
            gradientText: user.gradientText || false,
            typingEffect: user.typingEffect || false,
            avatarFrames: user.avatarFrames || ['default'],
            currentAvatarFrame: user.currentAvatarFrame || 'default',
            highlightedName: user.highlightedName || false,
            avatarUrl: user.avatarUrl || null,
            msgColor: user.msgColor || '#6C2BD9',
            seasonTier: user.seasonTier || 0,
            seasonExp: user.seasonExp || 0,
            seasonMaxExp: user.seasonMaxExp || 100,
            seasonIsElite: user.seasonIsElite || false,
            seasonClaimedRewards: user.seasonClaimedRewards || [],
            seasonClaimedElite: user.seasonClaimedElite || [],
            vipExpiry: user.vipExpiry || null,
            vipActive: vipActive,
            vipLastClaimDate: user.vipLastClaimDate || null
        };
        
        console.log(`🔄 Session refreshed for: ${username}`);
        
        res.json({ 
            success: true, 
            user: req.session.user 
        });
    } catch (e) {
        console.error('Refresh session error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi refresh session' });
    }
});

// ============================================================
// NOTIFICATION API ROUTES
// ============================================================
app.get('/api/notifications/:username', (req, res) => {
    try {
        const username = req.params.username;
        const notifications = getNotifications(username);
        res.json({ success: true, notifications });
    } catch (e) {
        console.error('Get notifications error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi tải thông báo' });
    }
});

app.post('/api/notifications/mark-read', (req, res) => {
    try {
        const { username, notificationId } = req.body;
        if (!username || !notificationId) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        const result = markNotificationRead(username, notificationId);
        if (result) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, msg: 'Không tìm thấy thông báo' });
        }
    } catch (e) {
        console.error('Mark notification read error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi đánh dấu đã đọc' });
    }
});

app.post('/api/notifications/mark-all-read', (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ success: false, msg: 'Thiếu username' });
        }
        markAllNotificationsRead(username);
        res.json({ success: true });
    } catch (e) {
        console.error('Mark all notifications read error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi đánh dấu tất cả đã đọc' });
    }
});

app.get('/api/notifications/unread-count/:username', (req, res) => {
    try {
        const username = req.params.username;
        const count = getUnreadCount(username);
        res.json({ success: true, count });
    } catch (e) {
        console.error('Get unread count error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi lấy số thông báo chưa đọc' });
    }
});

// ============================================================
// API ROUTES
// ============================================================
app.get('/api/users', (req, res) => {
    try {
        const users = getUsers();
        res.json(users.map(u => ({
            username: u.username,
            displayName: u.displayName,
            email: u.email,
            role: u.role || 'user',
            tier: u.tier,
            effects: u.effects || [],
            cash: u.cash || 0,
            totalTopup: u.totalTopup || 0,
            badges: u.badges || [],
            themes: u.themes || [],
            refreshTokens: u.refreshTokens || 0,
            currentBadge: u.currentBadge || null,
            frames: u.frames || ['default'],
            currentFrame: u.currentFrame || 'default',
            gradientText: u.gradientText || false,
            typingEffect: u.typingEffect || false,
            avatarFrames: u.avatarFrames || ['default'],
            currentAvatarFrame: u.currentAvatarFrame || 'default',
            highlightedName: u.highlightedName || false,
            avatarUrl: u.avatarUrl || null,
            msgColor: u.msgColor || '#6C2BD9',
            seasonTier: u.seasonTier || 0,
            seasonIsElite: u.seasonIsElite || false,
            vipActive: u.vipActive || false,
            vipExpiry: u.vipExpiry || null
        })));
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi tải danh sách users' });
    }
});

app.get('/api/user/:username', (req, res) => {
    try {
        const user = findUserByUsername(req.params.username);
        if (user) {
            res.json({
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                role: user.role || 'user',
                tier: user.tier,
                tierExpiry: user.tierExpiry,
                effects: user.effects || [],
                cash: user.cash || 0,
                totalTopup: user.totalTopup || 0,
                badges: user.badges || [],
                themes: user.themes || [],
                currentTheme: user.currentTheme || 'default',
                refreshTokens: user.refreshTokens || 0,
                currentBadge: user.currentBadge || null,
                frames: user.frames || ['default'],
                currentFrame: user.currentFrame || 'default',
                gradientText: user.gradientText || false,
                typingEffect: user.typingEffect || false,
                avatarFrames: user.avatarFrames || ['default'],
                currentAvatarFrame: user.currentAvatarFrame || 'default',
                highlightedName: user.highlightedName || false,
                avatarUrl: user.avatarUrl || null,
                msgColor: user.msgColor || '#6C2BD9',
                seasonTier: user.seasonTier || 0,
                seasonIsElite: user.seasonIsElite || false,
                vipActive: user.vipActive || false,
                vipExpiry: user.vipExpiry || null
            });
        } else {
            res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi tìm user' });
    }
});

app.post('/api/user/update', (req, res) => {
    try {
        const { username, data } = req.body;
        if (!username || !data) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        const updated = updateUser(username, data);
        if (updated) {
            io.emit('user-updated', { 
                username, 
                type: 'update', 
                data,
                fullUser: updated,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
            res.json({ success: true, user: updated });
        } else {
            res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi cập nhật user' });
    }
});

app.post('/api/user/badge', (req, res) => {
    try {
        const { username, badge } = req.body;
        if (!username) {
            return res.status(400).json({ success: false, msg: 'Thiếu username' });
        }
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }
        if (badge !== null && !user.badges.includes(badge)) {
            return res.status(400).json({ success: false, msg: 'Bạn không sở hữu badge này' });
        }
        const updated = updateUser(username, { currentBadge: badge });
        if (req.session && req.session.user && req.session.user.username === username) {
            req.session.user.currentBadge = badge;
        }
        io.emit('user-updated', { 
            username, 
            type: 'badge', 
            badge,
            fullUser: updated,
            timestamp: Date.now()
        });
        io.emit('force-refresh-user', {
            username: username,
            timestamp: Date.now()
        });
        res.json({ success: true, msg: 'Cập nhật badge thành công', currentBadge: badge });
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi cập nhật badge' });
    }
});

app.post('/api/user/theme', (req, res) => {
    try {
        const { username, themeKey } = req.body;
        if (!username || !themeKey) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }

        const themes = user.themes || ['default'];
        if (!themes.includes(themeKey) && themeKey !== 'default') {
            return res.status(400).json({ success: false, msg: 'Bạn không sở hữu theme này.' });
        }
        const updated = updateUser(username, { currentTheme: themeKey });
        if (req.session && req.session.user && req.session.user.username === username) {
            req.session.user.currentTheme = themeKey;
        }
        res.json({ success: true, msg: 'Đã đổi theme.', currentTheme: themeKey });
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi đổi theme' });
    }
});

// ============================================================
// FRIENDS API
// ============================================================
app.get('/api/friends/:username', (req, res) => {
    try {
        const friends = getFriends(req.params.username);
        res.json(friends);
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi tải danh sách bạn bè' });
    }
});

app.get('/api/friend-requests/:username', (req, res) => {
    try {
        const requests = getPendingRequests(req.params.username);
        res.json(requests);
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi tải lời mời kết bạn' });
    }
});

app.post('/api/friend-request', (req, res) => {
    try {
        const { from, to } = req.body;
        if (!from || !to) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        if (from === to) {
            return res.status(400).json({ success: false, msg: 'Không thể kết bạn với chính mình.' });
        }
        if (!findUserByUsername(to)) {
            return res.status(404).json({ success: false, msg: 'Người dùng không tồn tại.' });
        }
        if (getFriends(from).includes(to)) {
            return res.status(400).json({ success: false, msg: 'Đã là bạn bè.' });
        }
        let requests = getFriendRequests();
        if (requests.some(r => r.from === from && r.to === to && r.status === 'pending')) {
            return res.status(400).json({ success: false, msg: 'Đã gửi lời mời trước đó.' });
        }
        requests.push({ from, to, status: 'pending', time: new Date().toISOString() });
        saveFriendRequests(requests);
        updateBadges(from);
        
        addNotification(to, 'friend_request', {
            from: from,
            message: `${from} đã gửi lời mời kết bạn`
        });
        
        res.json({ success: true, msg: 'Đã gửi lời mời kết bạn.' });
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi gửi lời mời kết bạn' });
    }
});

app.post('/api/accept-friend', (req, res) => {
    try {
        const { from, to } = req.body;
        if (!from || !to) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        let requests = getFriendRequests();
        const idx = requests.findIndex(r => r.from === from && r.to === to && r.status === 'pending');
        if (idx === -1) {
            return res.status(404).json({ success: false, msg: 'Không tìm thấy lời mời.' });
        }
        requests[idx].status = 'accepted';
        saveFriendRequests(requests);
        let friendships = getFriendships();
        friendships.push({ user1: from, user2: to, status: 'accepted', time: new Date().toISOString() });
        saveFriendships(friendships);
        updateBadges(from);
        updateBadges(to);
        
        addNotification(from, 'friend_accepted', {
            from: to,
            message: `${to} đã chấp nhận lời mời kết bạn của bạn`
        });
        
        res.json({ success: true, msg: 'Đã chấp nhận lời mời.' });
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi chấp nhận lời mời' });
    }
});

app.delete('/api/friend/:username/:friend', (req, res) => {
    try {
        const { username, friend } = req.params;
        if (!username || !friend) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        let friendships = getFriendships();
        friendships = friendships.filter(f => !(f.user1 === username && f.user2 === friend) && !(f.user1 === friend && f.user2 === username));
        saveFriendships(friendships);
        const chatId = `private_${[username, friend].sort().join('_')}`;
        saveMessages(chatId, []);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi xóa bạn bè' });
    }
});

// ============================================================
// GROUPS API
// ============================================================
app.get('/api/groups/:username', (req, res) => {
    try {
        const members = getGroupMembers().filter(m => m.userId === req.params.username);
        const groups = getGroups().filter(g => members.some(m => m.groupId === g.id));
        groups.sort((a, b) => {
            if (a.id === 'chat_chung') return -1;
            if (b.id === 'chat_chung') return 1;
            return 0;
        });
        res.json(groups);
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi tải danh sách nhóm' });
    }
});

app.post('/api/group', (req, res) => {
    try {
        const { creator, name } = req.body;
        if (!creator) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        const groups = getGroups();
        const newGroup = { 
            id: 'g_' + Date.now(), 
            name: name || 'Nhóm mới', 
            createdBy: creator, 
            createdAt: new Date().toISOString(), 
            avatar: '👥',
            isPermanent: false
        };
        groups.push(newGroup);
        saveGroups(groups);
        const members = getGroupMembers();
        members.push({ groupId: newGroup.id, userId: creator, role: 'admin', joinedAt: new Date().toISOString() });
        saveGroupMembers(members);
        res.json({ success: true, group: newGroup });
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi tạo nhóm' });
    }
});

app.get('/api/group-members/:groupId', (req, res) => {
    try {
        const members = getGroupMembers().filter(m => m.groupId === req.params.groupId);
        const mutes = getGroupMutes();
        const bans = getGroupBans();
        const mutedUsers = mutes[req.params.groupId] || [];
        const bannedUsers = bans[req.params.groupId] || [];
        res.json({
            members: members,
            muted: mutedUsers,
            banned: bannedUsers
        });
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi tải thành viên nhóm' });
    }
});

app.post('/api/group/add-member', (req, res) => {
    try {
        const { groupId, userId } = req.body;
        if (!groupId || !userId) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        if (groupId === 'chat_chung') {
            return res.status(400).json({ success: false, msg: 'Chat Chung đã có tất cả mọi người' });
        }
        let members = getGroupMembers();
        if (members.some(m => m.groupId === groupId && m.userId === userId)) {
            return res.status(400).json({ success: false, msg: 'Đã có trong nhóm.' });
        }
        const group = getGroups().find(g => g.id === groupId);
        if (!group) {
            return res.status(404).json({ success: false, msg: 'Nhóm không tồn tại' });
        }
        const user = findUserByUsername(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'Người dùng không tồn tại' });
        }
        members.push({ groupId, userId, role: 'member', joinedAt: new Date().toISOString() });
        saveGroupMembers(members);
        io.to(groupId).emit('member-added', { groupId, userId, timestamp: Date.now() });
        io.to(groupId).emit('group-updated', { groupId, type: 'member_added', userId, timestamp: Date.now() });
        res.json({ success: true, msg: 'Đã thêm thành viên' });
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi thêm thành viên' });
    }
});

app.delete('/api/group-member/:groupId/:userId', (req, res) => {
    try {
        const { groupId, userId } = req.params;
        if (!groupId || !userId) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        if (groupId === 'chat_chung') {
            return res.status(400).json({ success: false, msg: 'Không thể rời Chat Chung' });
        }
        let members = getGroupMembers();
        members = members.filter(m => !(m.groupId === groupId && m.userId === userId));
        saveGroupMembers(members);
        removeMute(groupId, userId);
        removeBan(groupId, userId);
        io.to(groupId).emit('member-removed', { groupId, userId, timestamp: Date.now() });
        io.to(groupId).emit('group-updated', { groupId, type: 'member_removed', userId, timestamp: Date.now() });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi xóa thành viên' });
    }
});

// ============================================================
// GROUP MUTE/BAN API
// ============================================================
app.post('/api/group/mute', (req, res) => {
    try {
        const { groupId, userId } = req.body;
        if (!groupId || !userId) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        if (groupId === 'chat_chung') {
            return res.status(400).json({ success: false, msg: 'Không thể mute trong Chat Chung' });
        }
        
        const owner = getGroupOwner(groupId);
        if (!owner) {
            return res.status(404).json({ success: false, msg: 'Không tìm thấy nhóm' });
        }
        
        const members = getGroupMembers().filter(m => m.groupId === groupId);
        if (!members.some(m => m.userId === userId)) {
            return res.status(404).json({ success: false, msg: 'Thành viên không tồn tại trong nhóm' });
        }
        
        if (userId === owner) {
            return res.status(400).json({ success: false, msg: 'Không thể mute chủ nhóm' });
        }
        
        const result = addMute(groupId, userId);
        if (result) {
            io.to(groupId).emit('user-muted', { groupId, userId, timestamp: Date.now() });
            io.to(groupId).emit('group-updated', { groupId, type: 'user_muted', userId, timestamp: Date.now() });
            res.json({ success: true, msg: `Đã mute ${userId}` });
        } else {
            res.json({ success: false, msg: 'Thành viên đã bị mute' });
        }
    } catch (e) {
        console.error('Mute error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi mute: ' + e.message });
    }
});

app.post('/api/group/unmute', (req, res) => {
    try {
        const { groupId, userId } = req.body;
        if (!groupId || !userId) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        if (groupId === 'chat_chung') {
            return res.status(400).json({ success: false, msg: 'Không thể unmute trong Chat Chung' });
        }
        
        const result = removeMute(groupId, userId);
        if (result) {
            io.to(groupId).emit('user-unmuted', { groupId, userId, timestamp: Date.now() });
            io.to(groupId).emit('group-updated', { groupId, type: 'user_unmuted', userId, timestamp: Date.now() });
            res.json({ success: true, msg: `Đã bỏ mute ${userId}` });
        } else {
            res.json({ success: false, msg: 'Thành viên chưa bị mute' });
        }
    } catch (e) {
        console.error('Unmute error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi unmute: ' + e.message });
    }
});

app.post('/api/group/ban', (req, res) => {
    try {
        const { groupId, userId } = req.body;
        if (!groupId || !userId) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        if (groupId === 'chat_chung') {
            return res.status(400).json({ success: false, msg: 'Không thể ban trong Chat Chung' });
        }
        
        const owner = getGroupOwner(groupId);
        if (!owner) {
            return res.status(404).json({ success: false, msg: 'Không tìm thấy nhóm' });
        }
        
        const members = getGroupMembers().filter(m => m.groupId === groupId);
        if (!members.some(m => m.userId === userId)) {
            return res.status(404).json({ success: false, msg: 'Thành viên không tồn tại trong nhóm' });
        }
        
        if (userId === owner) {
            return res.status(400).json({ success: false, msg: 'Không thể ban chủ nhóm' });
        }
        
        const result = addBan(groupId, userId);
        if (result) {
            let updatedMembers = getGroupMembers().filter(m => !(m.groupId === groupId && m.userId === userId));
            saveGroupMembers(updatedMembers);
            
            io.to(groupId).emit('user-banned', { groupId, userId, timestamp: Date.now() });
            io.to(groupId).emit('member-removed', { groupId, userId, timestamp: Date.now() });
            io.to(groupId).emit('group-updated', { groupId, type: 'user_banned', userId, timestamp: Date.now() });
            
            res.json({ success: true, msg: `Đã ban ${userId}` });
        } else {
            res.json({ success: false, msg: 'Thành viên đã bị ban' });
        }
    } catch (e) {
        console.error('Ban error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi ban: ' + e.message });
    }
});

app.post('/api/group/unban', (req, res) => {
    try {
        const { groupId, userId } = req.body;
        if (!groupId || !userId) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        if (groupId === 'chat_chung') {
            return res.status(400).json({ success: false, msg: 'Không thể unban trong Chat Chung' });
        }
        
        const result = removeBan(groupId, userId);
        if (result) {
            io.to(groupId).emit('user-unbanned', { groupId, userId, timestamp: Date.now() });
            io.to(groupId).emit('group-updated', { groupId, type: 'user_unbanned', userId, timestamp: Date.now() });
            res.json({ success: true, msg: `Đã bỏ ban ${userId}` });
        } else {
            res.json({ success: false, msg: 'Thành viên chưa bị ban' });
        }
    } catch (e) {
        console.error('Unban error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi unban: ' + e.message });
    }
});

// ============================================================
// MESSAGES API
// ============================================================
app.get('/api/messages/:chatId', (req, res) => {
    try { 
        const messages = loadMessages(req.params.chatId);
        res.json(messages); 
    } catch (e) { 
        res.status(500).json({ success: false, msg: 'Lỗi tải tin nhắn' });
    }
});

app.delete('/api/messages/:chatId', (req, res) => {
    try { 
        if (req.params.chatId === 'group_chat_chung') {
            return res.status(400).json({ success: false, msg: 'Không thể xóa tin nhắn trong Chat Chung' });
        }
        saveMessages(req.params.chatId, []); 
        res.json({ success: true }); 
    } catch (e) { 
        res.status(500).json({ success: false, msg: 'Lỗi xóa tin nhắn' });
    }
});

// ============================================================
// SEASON PASS - CONSTANTS
// ============================================================
const SEASON_REWARDS = [];
for (let i = 1; i <= 50; i++) {
    let reward = { level: i, free: null, elite: null };
    
    if (i % 2 === 1) {
        reward.free = { type: 'cash', amount: i * 500, icon: '💵', name: `${i * 500} 💵` };
    } else if (i % 4 === 0 && i <= 40) {
        const effects = ['twinkle','shimmer','glow','bubble','explode','rainbow','fire','dragon'];
        const names = ['Lấp lánh','Sáng bóng','Chói lóa','Bong bóng','Nổ','Cầu vồng','Lửa','Rồng cuộn'];
        reward.free = { type: 'effect', key: effects[(i/4 - 1) % 8], icon: '✨', name: names[(i/4 - 1) % 8] };
    } else if (i === 10) {
        reward.free = { type: 'badge', name: 'Chiến binh mùa', icon: '🏅' };
    } else if (i === 20) {
        reward.free = { type: 'badge', name: 'Thợ săn', icon: '🏅' };
    } else if (i === 30) {
        reward.free = { type: 'badge', name: 'Huyền thoại', icon: '🏅' };
    } else if (i === 50) {
        reward.free = { type: 'rank', key: 'legend', icon: '🌟', name: 'Rank Huyền thoại (7 ngày)' };
    } else {
        reward.free = { type: 'cash', amount: i * 300, icon: '💵', name: `${i * 300} 💵` };
    }
    
    if (i === 5) {
        reward.elite = { type: 'effect', key: 'shimmer', icon: '💫', name: 'Hiệu ứng Sáng bóng' };
    } else if (i === 10) {
        reward.elite = { type: 'avatarframe', key: 'avtframe1', icon: '👑', name: 'Khung Avatar Vàng' };
    } else if (i === 15) {
        reward.elite = { type: 'effect', key: 'glow', icon: '🌟', name: 'Hiệu ứng Chói lóa' };
    } else if (i === 20) {
        reward.elite = { type: 'frame', key: 'frame1', icon: '🖼️', name: 'Khung Vàng' };
    } else if (i === 25) {
        reward.elite = { type: 'effect', key: 'bubble', icon: '🫧', name: 'Hiệu ứng Bong bóng' };
    } else if (i === 30) {
        reward.elite = { type: 'avatarframe', key: 'avtframe2', icon: '👑', name: 'Khung Avatar Bạch kim' };
    } else if (i === 35) {
        reward.elite = { type: 'effect', key: 'explode', icon: '💥', name: 'Hiệu ứng Nổ' };
    } else if (i === 40) {
        reward.elite = { type: 'frame', key: 'frame3', icon: '🖼️', name: 'Khung Kim Cương' };
    } else if (i === 45) {
        reward.elite = { type: 'effect', key: 'dragon', icon: '🐉', name: 'Hiệu ứng Rồng cuộn' };
    } else if (i === 50) {
        reward.elite = { type: 'rank', key: 'vip', icon: '👑', name: 'Rank VIP (7 ngày)' };
    } else if (i % 3 === 0) {
        reward.elite = { type: 'cash', amount: i * 800, icon: '💵', name: `${i * 800} 💵` };
    } else {
        reward.elite = { type: 'cash', amount: i * 500, icon: '💵', name: `${i * 500} 💵` };
    }
    
    SEASON_REWARDS.push(reward);
}

const MISSIONS_DEF = {
    daily: [
        { id: 'daily_login', name: 'Đăng nhập hôm nay', icon: '✅', exp: 10, target: 1 },
        { id: 'daily_messages_10', name: 'Gửi 10 tin nhắn', icon: '💬', exp: 15, target: 10 },
        { id: 'daily_messages_30', name: 'Gửi 30 tin nhắn', icon: '💬', exp: 25, target: 30 },
        { id: 'daily_chat_3', name: 'Chat với 3 người khác', icon: '👥', exp: 20, target: 3 },
        { id: 'daily_friend', name: 'Kết bạn mới', icon: '🤝', exp: 30, target: 1 }
    ],
    weekly: [
        { id: 'weekly_messages_100', name: 'Gửi 100 tin nhắn', icon: '💬', exp: 50, target: 100 },
        { id: 'weekly_chat_10', name: 'Chat với 10 người khác', icon: '👥', exp: 60, target: 10 },
        { id: 'weekly_friends_3', name: 'Kết bạn 3 người', icon: '🤝', exp: 80, target: 3 }
    ],
    special: [
        { id: 'special_effects_5', name: 'Sở hữu 5 hiệu ứng', icon: '✨', exp: 120, target: 5 },
        { id: 'special_rank_gold', name: 'Đạt rank Vàng', icon: '🥇', exp: 150, target: 1 },
        { id: 'special_refer_3', name: 'Mời 3 bạn bè tham gia', icon: '📨', exp: 200, target: 3 }
    ]
};

// ============================================================
// SEASON PASS - HELPER FUNCTIONS
// ============================================================
function getSeasonData(user) {
    return {
        tier: user.seasonTier || 0,
        exp: user.seasonExp || 0,
        maxExp: user.seasonMaxExp || 100,
        isElite: user.seasonIsElite || false,
        claimedRewards: user.seasonClaimedRewards || [],
        claimedElite: user.seasonClaimedElite || [],
        missions: user.seasonMissions || {},
        lastReset: user.seasonLastReset || new Date().toISOString()
    };
}

function updateSeasonData(username, data) {
    return updateUser(username, {
        seasonTier: data.tier,
        seasonExp: data.exp,
        seasonMaxExp: data.maxExp,
        seasonIsElite: data.isElite,
        seasonClaimedRewards: data.claimedRewards,
        seasonClaimedElite: data.claimedElite,
        seasonMissions: data.missions,
        seasonLastReset: data.lastReset
    });
}

function checkAndRemoveExpiredEffects(user) {
    if (!user.seasonEffectsExpiry) return user;
    
    const now = Date.now();
    const effects = user.effects || [];
    const expiry = user.seasonEffectsExpiry || {};
    let removed = false;
    
    const newEffects = effects.filter(effect => {
        if (expiry[effect] && expiry[effect] < now) {
            removed = true;
            delete expiry[effect];
            return false;
        }
        return true;
    });
    
    if (removed) {
        return updateUser(user.username, { 
            effects: newEffects,
            seasonEffectsExpiry: expiry
        });
    }
    return user;
}

function addEffectWithExpiry(user, effectKey) {
    const expiry = user.seasonEffectsExpiry || {};
    const effects = user.effects || [];
    
    if (!effects.includes(effectKey)) {
        effects.push(effectKey);
    }
    expiry[effectKey] = Date.now() + 7 * 24 * 60 * 60 * 1000;
    
    return updateUser(user.username, {
        effects: effects,
        seasonEffectsExpiry: expiry
    });
}

function applyReward(user, reward, fromSeason = false) {
    if (!reward) return user;
    
    let updated = user;
    
    switch (reward.type) {
        case 'cash':
            const newCash = (user.cash || 0) + reward.amount;
            updated = updateUser(user.username, { cash: newCash });
            break;
        case 'effect':
            if (fromSeason) {
                updated = addEffectWithExpiry(user, reward.key);
            } else {
                let effects = user.effects || [];
                if (!effects.includes(reward.key)) {
                    effects.push(reward.key);
                    updated = updateUser(user.username, { effects });
                }
            }
            break;
        case 'theme':
            let themes = user.themes || ['default'];
            if (!themes.includes(reward.key)) {
                themes.push(reward.key);
                updated = updateUser(user.username, { themes });
            }
            break;
        case 'frame':
            let frames = user.frames || ['default'];
            if (!frames.includes(reward.key)) {
                frames.push(reward.key);
                updated = updateUser(user.username, { frames });
            }
            break;
        case 'avatarframe':
            let avatarFrames = user.avatarFrames || ['default'];
            if (!avatarFrames.includes(reward.key)) {
                avatarFrames.push(reward.key);
                updated = updateUser(user.username, { avatarFrames });
            }
            break;
        case 'rank':
            const expiry = new Date(Date.now() + 7*24*60*60*1000).toISOString();
            updated = updateUser(user.username, { tier: reward.key, tierExpiry: expiry });
            break;
        case 'badge':
            let badges = user.badges || [];
            if (!badges.includes(reward.name)) {
                badges.push(reward.name);
                updated = updateUser(user.username, { badges });
            }
            break;
        default:
            updated = user;
    }
    
    return updated || user;
}

// ============================================================
// SEASON PASS - API ROUTES
// ============================================================
app.get('/api/season/:username', (req, res) => {
    try {
        const user = findUserByUsername(req.params.username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }
        
        const updatedUser = checkAndRemoveExpiredEffects(user);
        const finalUser = updatedUser || user;
        
        let missions = finalUser.seasonMissions || {};
        const lastReset = finalUser.seasonLastReset || new Date().toISOString();
        const today = new Date().toISOString().split('T')[0];
        const lastResetDate = new Date(lastReset).toISOString().split('T')[0];
        
        if (today !== lastResetDate) {
            MISSIONS_DEF.daily.forEach(m => {
                missions[m.id] = { current: 0, claimed: false };
            });
            MISSIONS_DEF.weekly.forEach(m => {
                if (!missions[m.id]) missions[m.id] = { current: 0, claimed: false };
            });
            MISSIONS_DEF.special.forEach(m => {
                if (!missions[m.id]) missions[m.id] = { current: 0, claimed: false };
            });
            
            const updated = updateUser(finalUser.username, {
                seasonMissions: missions,
                seasonLastReset: new Date().toISOString()
            });
            
            if (updated) {
                finalUser = updated;
            }
        } else {
            let needUpdate = false;
            MISSIONS_DEF.daily.forEach(m => {
                if (!missions[m.id]) {
                    missions[m.id] = { current: 0, claimed: false };
                    needUpdate = true;
                }
            });
            MISSIONS_DEF.weekly.forEach(m => {
                if (!missions[m.id]) {
                    missions[m.id] = { current: 0, claimed: false };
                    needUpdate = true;
                }
            });
            MISSIONS_DEF.special.forEach(m => {
                if (!missions[m.id]) {
                    missions[m.id] = { current: 0, claimed: false };
                    needUpdate = true;
                }
            });
            
            if (needUpdate) {
                const updated = updateUser(finalUser.username, { seasonMissions: missions });
                if (updated) {
                    finalUser = updated;
                }
            }
        }
        
        const seasonData = getSeasonData(finalUser);
        res.json({ success: true, data: seasonData });
    } catch (e) {
        console.error('Get season data error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi tải dữ liệu mùa' });
    }
});

app.post('/api/season/claim', (req, res) => {
    try {
        const { username, level, isElite } = req.body;
        if (!username || level === undefined) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }
        
        const seasonData = getSeasonData(user);
        const tier = seasonData.tier;
        
        if (level > tier) {
            return res.status(400).json({ success: false, msg: 'Chưa đạt cấp này' });
        }
        
        const reward = SEASON_REWARDS.find(r => r.level === level);
        if (!reward) {
            return res.status(400).json({ success: false, msg: 'Phần thưởng không tồn tại' });
        }
        
        if (isElite) {
            if (!seasonData.isElite) {
                return res.status(400).json({ success: false, msg: 'Bạn chưa có Elite Pass' });
            }
            if (seasonData.claimedElite.includes(level)) {
                return res.status(400).json({ success: false, msg: 'Đã nhận phần thưởng này' });
            }
            if (!reward.elite) {
                return res.status(400).json({ success: false, msg: 'Không có phần thưởng Elite ở cấp này' });
            }
            
            const newClaimed = [...seasonData.claimedElite, level];
            const updatedData = { ...seasonData, claimedElite: newClaimed };
            const updated = updateSeasonData(username, updatedData);
            
            if (updated) {
                const finalUser = applyReward(updated, reward.elite, true);
                const newSeasonData = getSeasonData(finalUser);
                
                io.emit('season-updated', {
                    username: username,
                    seasonData: newSeasonData,
                    timestamp: Date.now()
                });
                
                if (reward.elite.type === 'cash') {
                    const targetSocketId = userSockets[username];
                    if (targetSocketId) {
                        io.to(targetSocketId).emit('cash-updated', {
                            username: username,
                            newCash: finalUser.cash || 0,
                            amount: reward.elite.amount,
                            timestamp: Date.now()
                        });
                    }
                }
                
                checkAndUnlockAchievements(username);
                
                return res.json({ success: true, msg: 'Đã nhận phần thưởng Elite!', data: newSeasonData });
            }
        } else {
            if (seasonData.claimedRewards.includes(level)) {
                return res.status(400).json({ success: false, msg: 'Đã nhận phần thưởng này' });
            }
            if (!reward.free) {
                return res.status(400).json({ success: false, msg: 'Không có phần thưởng ở cấp này' });
            }
            
            const newClaimed = [...seasonData.claimedRewards, level];
            const updatedData = { ...seasonData, claimedRewards: newClaimed };
            const updated = updateSeasonData(username, updatedData);
            
            if (updated) {
                const finalUser = applyReward(updated, reward.free, true);
                const newSeasonData = getSeasonData(finalUser);
                
                io.emit('season-updated', {
                    username: username,
                    seasonData: newSeasonData,
                    timestamp: Date.now()
                });
                
                if (reward.free.type === 'cash') {
                    const targetSocketId = userSockets[username];
                    if (targetSocketId) {
                        io.to(targetSocketId).emit('cash-updated', {
                            username: username,
                            newCash: finalUser.cash || 0,
                            amount: reward.free.amount,
                            timestamp: Date.now()
                        });
                    }
                }
                
                checkAndUnlockAchievements(username);
                
                return res.json({ success: true, msg: 'Đã nhận phần thưởng!', data: newSeasonData });
            }
        }
        
        res.status(500).json({ success: false, msg: 'Lỗi nhận thưởng' });
    } catch (e) {
        console.error('Claim reward error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi nhận thưởng: ' + e.message });
    }
});

app.post('/api/season/upgrade', (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ success: false, msg: 'Thiếu username' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }
        
        if (user.seasonIsElite) {
            return res.status(400).json({ success: false, msg: 'Bạn đã có Elite Pass' });
        }
        
        const price = 250000;
        if ((user.cash || 0) < price) {
            return res.status(400).json({ success: false, msg: `Không đủ 💵. Cần ${price.toLocaleString()} 💵 để nâng cấp Elite Pass` });
        }
        
        const newCash = (user.cash || 0) - price;
        const updated = updateUser(user.username, {
            seasonIsElite: true,
            cash: newCash
        });
        
        if (updated) {
            const seasonData = getSeasonData(updated);
            
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: price,
                    timestamp: Date.now()
                });
            }
            
            io.emit('season-updated', {
                username: username,
                seasonData: seasonData,
                timestamp: Date.now()
            });
            
            io.emit('user-updated', {
                username: username,
                type: 'season_upgrade',
                fullUser: updated,
                timestamp: Date.now()
            });
            
            checkAndUnlockAchievements(username);
            
            res.json({ 
                success: true, 
                msg: 'Nâng cấp Elite Pass thành công! (Chỉ mở khóa Elite, vẫn phải làm nhiệm vụ)', 
                user: updated,
                seasonData: seasonData
            });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi nâng cấp' });
        }
    } catch (e) {
        console.error('Upgrade pass error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi nâng cấp: ' + e.message });
    }
});

app.post('/api/season/buy-elite-pass', (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ success: false, msg: 'Thiếu username' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }
        
        if (user.seasonIsElite) {
            return res.status(400).json({ success: false, msg: 'Bạn đã có Elite Pass' });
        }
        
        const price = 400000;
        if ((user.cash || 0) < price) {
            return res.status(400).json({ success: false, msg: `Không đủ 💵. Cần ${price.toLocaleString()} 💵 để mua Elite Pass (nhận toàn bộ phần thưởng)` });
        }
        
        const newCash = (user.cash || 0) - price;
        let updatedUser = updateUser(user.username, { 
            seasonIsElite: true,
            cash: newCash,
            seasonTier: 50,
            seasonExp: 0,
            seasonMaxExp: 100
        });
        
        if (!updatedUser) {
            return res.status(500).json({ success: false, msg: 'Lỗi cập nhật user' });
        }
        
        let allRewards = [];
        let claimedRewards = updatedUser.seasonClaimedRewards || [];
        let claimedElite = updatedUser.seasonClaimedElite || [];
        let allClaimedFree = [];
        let allClaimedElite = [];
        
        for (let i = 1; i <= 50; i++) {
            const reward = SEASON_REWARDS.find(r => r.level === i);
            if (reward) {
                if (!claimedRewards.includes(i) && reward.free) {
                    allClaimedFree.push(i);
                    updatedUser = applyReward(updatedUser, reward.free, true);
                    allRewards.push(reward.free);
                }
                if (!claimedElite.includes(i) && reward.elite) {
                    allClaimedElite.push(i);
                    updatedUser = applyReward(updatedUser, reward.elite, true);
                    allRewards.push(reward.elite);
                }
            }
        }
        
        const finalUser = updateUser(updatedUser.username, {
            seasonClaimedRewards: [...claimedRewards, ...allClaimedFree],
            seasonClaimedElite: [...claimedElite, ...allClaimedElite]
        });
        
        if (finalUser) {
            const seasonData = getSeasonData(finalUser);
            
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: finalUser.cash || 0,
                    amount: price,
                    timestamp: Date.now()
                });
            }
            
            io.emit('season-updated', {
                username: username,
                seasonData: seasonData,
                timestamp: Date.now()
            });
            
            io.emit('user-updated', {
                username: username,
                type: 'season_buy_elite',
                fullUser: finalUser,
                timestamp: Date.now()
            });
            
            addNotification(username, 'season_elite_purchased', {
                message: `Bạn đã mua Elite Pass và nhận được ${allRewards.length} phần thưởng!`,
                rewards: allRewards
            });
            
            checkAndUnlockAchievements(username);
            
            res.json({ 
                success: true, 
                msg: `Mua Elite Pass thành công! Đã nhận ${allRewards.length} phần thưởng!`,
                user: finalUser,
                seasonData: seasonData,
                rewards: allRewards
            });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật phần thưởng' });
        }
    } catch (e) {
        console.error('Buy elite pass error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi mua Elite Pass: ' + e.message });
    }
});

app.post('/api/season/add-exp', (req, res) => {
    try {
        const { username, amount, source } = req.body;
        if (!username || !amount) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }
        
        let seasonData = getSeasonData(user);
        let newExp = (seasonData.exp || 0) + amount;
        let newTier = seasonData.tier || 0;
        let maxExp = seasonData.maxExp || 100;
        
        while (newExp >= maxExp && newTier < 50) {
            newExp -= maxExp;
            newTier++;
            maxExp = Math.min(100 + (newTier * 10), 500);
        }
        
        if (newTier >= 50) {
            newExp = 0;
            maxExp = 100;
        }
        
        const updatedData = {
            ...seasonData,
            exp: newExp,
            tier: newTier,
            maxExp: maxExp
        };
        
        const updated = updateSeasonData(username, updatedData);
        
        if (updated) {
            const newSeasonData = getSeasonData(updated);
            
            io.emit('season-updated', {
                username: username,
                seasonData: newSeasonData,
                source: source,
                amount: amount,
                timestamp: Date.now()
            });
            
            checkAndUnlockAchievements(username);
            
            res.json({ 
                success: true, 
                data: newSeasonData,
                leveledUp: newTier > seasonData.tier
            });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật EXP' });
        }
    } catch (e) {
        console.error('Add exp error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi cộng EXP: ' + e.message });
    }
});

app.post('/api/season/claim-mission', async (req, res) => {
    try {
        const { username, missionId } = req.body;
        if (!username || !missionId) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }
        
        let missions = user.seasonMissions || {};
        const mission = missions[missionId];
        
        if (!mission) {
            return res.status(404).json({ success: false, msg: 'Không tìm thấy nhiệm vụ' });
        }
        
        if (mission.claimed) {
            return res.status(400).json({ success: false, msg: 'Nhiệm vụ đã được nhận thưởng' });
        }
        
        let missionDef = null;
        for (const group of ['daily', 'weekly', 'special']) {
            const found = MISSIONS_DEF[group].find(m => m.id === missionId);
            if (found) {
                missionDef = found;
                break;
            }
        }
        
        if (!missionDef) {
            return res.status(404).json({ success: false, msg: 'Không tìm thấy định nghĩa nhiệm vụ' });
        }
        
        if (mission.current < missionDef.target) {
            return res.status(400).json({ success: false, msg: 'Chưa hoàn thành nhiệm vụ' });
        }
        
        mission.claimed = true;
        const updatedUser = updateUser(user.username, { seasonMissions: missions });
        
        if (updatedUser) {
            let seasonData = getSeasonData(updatedUser);
            let newExp = (seasonData.exp || 0) + missionDef.exp;
            let newTier = seasonData.tier || 0;
            let maxExp = seasonData.maxExp || 100;
            
            while (newExp >= maxExp && newTier < 50) {
                newExp -= maxExp;
                newTier++;
                maxExp = Math.min(100 + (newTier * 10), 500);
            }
            
            if (newTier >= 50) {
                newExp = 0;
                maxExp = 100;
            }
            
            const updatedData = {
                ...seasonData,
                exp: newExp,
                tier: newTier,
                maxExp: maxExp
            };
            
            const finalUser = updateSeasonData(username, updatedData);
            
            if (finalUser) {
                const finalSeasonData = getSeasonData(finalUser);
                
                io.emit('season-updated', {
                    username: username,
                    seasonData: finalSeasonData,
                    timestamp: Date.now()
                });
                
                checkAndUnlockAchievements(username);
                
                res.json({ 
                    success: true, 
                    msg: `Đã nhận thưởng nhiệm vụ! +${missionDef.exp} EXP`,
                    exp: missionDef.exp,
                    data: finalSeasonData
                });
            } else {
                res.status(500).json({ success: false, msg: 'Lỗi cập nhật EXP' });
            }
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật nhiệm vụ' });
        }
    } catch (e) {
        console.error('Claim mission error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi nhận nhiệm vụ: ' + e.message });
    }
});

app.post('/api/season/update-mission', (req, res) => {
    try {
        const { username, type } = req.body;
        if (!username || !type) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }
        
        let missions = user.seasonMissions || {};
        const today = new Date().toISOString().split('T')[0];
        const lastReset = user.seasonLastReset || new Date().toISOString();
        const lastResetDate = new Date(lastReset).toISOString().split('T')[0];
        
        if (today !== lastResetDate) {
            MISSIONS_DEF.daily.forEach(m => {
                missions[m.id] = { current: 0, claimed: false };
            });
            MISSIONS_DEF.weekly.forEach(m => {
                if (!missions[m.id]) missions[m.id] = { current: 0, claimed: false };
            });
            MISSIONS_DEF.special.forEach(m => {
                if (!missions[m.id]) missions[m.id] = { current: 0, claimed: false };
            });
            updateUser(user.username, { seasonMissions: missions, seasonLastReset: new Date().toISOString() });
            const refreshedUser = findUserByUsername(username);
            if (refreshedUser) {
                missions = refreshedUser.seasonMissions || {};
            }
        }
        
        let updated = false;
        
        if (type === 'message') {
            if (missions.daily_messages_10 !== undefined && !missions.daily_messages_10.claimed) {
                missions.daily_messages_10.current = (missions.daily_messages_10.current || 0) + 1;
                updated = true;
            }
            if (missions.daily_messages_30 !== undefined && !missions.daily_messages_30.claimed) {
                missions.daily_messages_30.current = (missions.daily_messages_30.current || 0) + 1;
                updated = true;
            }
            if (missions.weekly_messages_100 !== undefined && !missions.weekly_messages_100.claimed) {
                missions.weekly_messages_100.current = (missions.weekly_messages_100.current || 0) + 1;
                updated = true;
            }
        } else if (type === 'login') {
            if (missions.daily_login !== undefined && !missions.daily_login.claimed) {
                missions.daily_login.current = 1;
                updated = true;
            }
        } else if (type === 'friend') {
            if (missions.daily_friend !== undefined && !missions.daily_friend.claimed) {
                missions.daily_friend.current = (missions.daily_friend.current || 0) + 1;
                updated = true;
            }
            if (missions.weekly_friends_3 !== undefined && !missions.weekly_friends_3.claimed) {
                missions.weekly_friends_3.current = (missions.weekly_friends_3.current || 0) + 1;
                updated = true;
            }
        }
        
        if (updated) {
            updateUser(user.username, { seasonMissions: missions });
            const updatedUser = findUserByUsername(username);
            const seasonData = getSeasonData(updatedUser);
            io.emit('season-updated', {
                username: username,
                seasonData: seasonData,
                timestamp: Date.now()
            });
        }
        
        res.json({ success: true });
    } catch (e) {
        console.error('Update mission error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi cập nhật nhiệm vụ: ' + e.message });
    }
});

// ============================================================
// VIP SYSTEM
// ============================================================
app.post('/api/vip/activate', (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ success: false, msg: 'Thiếu username' });
        }

        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }

        if (user.vipExpiry && new Date(user.vipExpiry) > new Date()) {
            return res.status(400).json({ success: false, msg: 'Bạn đã có VIP!' });
        }

        const price = 200000;
        if ((user.cash || 0) < price) {
            return res.status(400).json({ success: false, msg: `Không đủ 💵. Cần ${price.toLocaleString()} 💵` });
        }

        const newCash = (user.cash || 0) - price;
        const vipExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        const updated = updateUser(username, {
            cash: newCash,
            vipExpiry: vipExpiry,
            vipActive: true,
            vipLastClaimDate: null
        });

        if (updated) {
            const vipData = {
                isActive: true,
                expiry: vipExpiry,
                lastClaimDate: null,
                dailyClaimed: false
            };

            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: price,
                    timestamp: Date.now()
                });
                io.to(targetSocketId).emit('vip-updated', {
                    username: username,
                    vipData: vipData,
                    timestamp: Date.now()
                });
            }

            io.emit('user-updated', {
                username: username,
                type: 'vip_activate',
                fullUser: updated,
                timestamp: Date.now()
            });

            checkAndUnlockAchievements(username);

            res.json({
                success: true,
                msg: 'Kích hoạt VIP thành công!',
                user: updated,
                vipData: vipData
            });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi kích hoạt VIP' });
        }
    } catch (e) {
        console.error('Activate VIP error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi kích hoạt VIP: ' + e.message });
    }
});

app.post('/api/vip/claim', (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ success: false, msg: 'Thiếu username' });
        }

        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }

        if (!user.vipExpiry || new Date(user.vipExpiry) <= new Date()) {
            return res.status(400).json({ success: false, msg: 'VIP đã hết hạn!' });
        }

        const today = new Date().toISOString().split('T')[0];
        const lastClaim = user.vipLastClaimDate ? new Date(user.vipLastClaimDate).toISOString().split('T')[0] : null;
        if (lastClaim === today) {
            return res.status(400).json({ success: false, msg: 'Bạn đã nhận thưởng VIP hôm nay!' });
        }

        const reward = 2000;
        const newCash = (user.cash || 0) + reward;

        const updated = updateUser(username, {
            cash: newCash,
            vipLastClaimDate: new Date().toISOString()
        });

        if (updated) {
            const vipData = {
                isActive: true,
                expiry: user.vipExpiry,
                lastClaimDate: new Date().toISOString(),
                dailyClaimed: true
            };

            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: reward,
                    timestamp: Date.now()
                });
                io.to(targetSocketId).emit('vip-updated', {
                    username: username,
                    vipData: vipData,
                    timestamp: Date.now()
                });
            }

            io.emit('user-updated', {
                username: username,
                type: 'vip_claim',
                fullUser: updated,
                timestamp: Date.now()
            });

            checkAndUnlockAchievements(username);

            res.json({
                success: true,
                msg: `Đã nhận ${reward.toLocaleString()} 💵 VIP!`,
                user: updated,
                vipData: vipData
            });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi nhận thưởng VIP' });
        }
    } catch (e) {
        console.error('Claim VIP error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi nhận thưởng VIP: ' + e.message });
    }
});

app.get('/api/vip/:username', (req, res) => {
    try {
        const username = req.params.username;
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }

        const isActive = user.vipExpiry && new Date(user.vipExpiry) > new Date();
        const today = new Date().toISOString().split('T')[0];
        const lastClaim = user.vipLastClaimDate ? new Date(user.vipLastClaimDate).toISOString().split('T')[0] : null;

        const vipData = {
            isActive: isActive,
            expiry: user.vipExpiry || null,
            lastClaimDate: user.vipLastClaimDate || null,
            dailyClaimed: lastClaim === today
        };

        res.json({ success: true, data: vipData });
    } catch (e) {
        console.error('Get VIP data error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi tải dữ liệu VIP' });
    }
});

// ============================================================
// BIRTHDAY
// ============================================================
app.get('/api/user/birthday/:username', (req, res) => {
    try {
        const username = req.params.username;
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }

        const today = new Date();
        const currentYear = today.getFullYear();
        const birthDate = user.birthDate || new Date(currentYear, 0, 1);
        
        const isBirthday = birthDate.getDate() === today.getDate() && 
                          birthDate.getMonth() === today.getMonth();
        const claimed = user.birthdayClaimed || false;

        res.json({
            success: true,
            isBirthday: isBirthday && !claimed,
            claimed: claimed,
            birthDate: birthDate.toISOString()
        });
    } catch (e) {
        console.error('Check birthday error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi kiểm tra sinh nhật' });
    }
});

app.post('/api/user/birthday-claim', (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ success: false, msg: 'Thiếu username' });
        }

        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }

        if (user.birthdayClaimed) {
            return res.status(400).json({ success: false, msg: 'Bạn đã nhận quà sinh nhật!' });
        }

        const today = new Date();
        const currentYear = today.getFullYear();
        const birthDate = user.birthDate || new Date(currentYear, 0, 1);
        const isBirthday = birthDate.getDate() === today.getDate() && 
                          birthDate.getMonth() === today.getMonth();

        if (!isBirthday) {
            return res.status(400).json({ success: false, msg: 'Hôm nay không phải sinh nhật của bạn!' });
        }

        const newCash = (user.cash || 0) + 5000;
        let effects = user.effects || [];
        if (!effects.includes('bubble')) {
            effects.push('bubble');
        }

        const updated = updateUser(username, {
            cash: newCash,
            effects: effects,
            birthdayClaimed: true
        });

        if (updated) {
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: 5000,
                    timestamp: Date.now()
                });
                io.to(targetSocketId).emit('user-updated', {
                    username: username,
                    type: 'birthday',
                    fullUser: updated,
                    timestamp: Date.now()
                });
            }

            io.emit('user-updated', {
                username: username,
                type: 'birthday_claim',
                fullUser: updated,
                timestamp: Date.now()
            });

            checkAndUnlockAchievements(username);

            res.json({
                success: true,
                msg: '🎂 Chúc mừng sinh nhật! Đã nhận 5,000 💵 + Hiệu ứng Bong bóng!',
                user: updated
            });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi nhận quà sinh nhật' });
        }
    } catch (e) {
        console.error('Claim birthday error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi nhận quà sinh nhật: ' + e.message });
    }
});

// ============================================================
// ACHIEVEMENTS API
// ============================================================
app.get('/api/achievements/:username', (req, res) => {
    try {
        const username = req.params.username;
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }

        checkAndUnlockAchievements(username);

        const updatedUser = findUserByUsername(username);
        res.json({
            success: true,
            achievements: updatedUser.achievements || {}
        });
    } catch (e) {
        console.error('Get achievements error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi tải thành tựu' });
    }
});

app.post('/api/achievements/unlock', (req, res) => {
    try {
        const { username, achievementId } = req.body;
        if (!username || !achievementId) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin' });
        }

        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }

        const achievements = user.achievements || {};
        if (!achievements[achievementId]) {
            achievements[achievementId] = true;
            updateUser(username, { achievements });
            
            const def = ACHIEVEMENTS_DEF[achievementId];
            if (def) {
                addNotification(username, 'achievement', {
                    name: def.name,
                    icon: def.icon,
                    message: `🏆 Đã mở khóa thành tựu: ${def.name}`
                });
            }
        }

        res.json({ success: true });
    } catch (e) {
        console.error('Unlock achievement error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi mở khóa thành tựu' });
    }
});

// ============================================================
// RANDOM EFFECTS (3 hours)
// ============================================================
const RANDOM_EFFECTS_FILE = path.join(__dirname, 'random_effects.json');

function getRandomEffectsData() {
    try {
        if (fs.existsSync(RANDOM_EFFECTS_FILE)) {
            return JSON.parse(fs.readFileSync(RANDOM_EFFECTS_FILE, 'utf8'));
        }
    } catch (e) {}
    return null;
}

function saveRandomEffectsData(data) {
    fs.writeFileSync(RANDOM_EFFECTS_FILE, JSON.stringify(data, null, 2));
}

function generateRandomEffects() {
    const allEffects = [
        { key: 'twinkle', label: 'Lấp lánh', price: 25000 },
        { key: 'shimmer', label: 'Sáng bóng', price: 28000 },
        { key: 'glow', label: 'Chói lóa', price: 30000 },
        { key: 'bubble', label: 'Bong bóng', price: 25000 },
        { key: 'explode', label: 'Nổ', price: 35000 },
        { key: 'rainbow', label: 'Cầu vồng', price: 35000 },
        { key: 'fire', label: 'Lửa', price: 30000 },
        { key: 'dragon', label: 'Rồng cuộn', price: 40000 }
    ];
    
    const shuffled = [...allEffects].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    const expiry = Date.now() + 3 * 60 * 60 * 1000;
    
    return { effects: selected, expiry };
}

app.get('/api/store/random-effects', (req, res) => {
    try {
        let data = getRandomEffectsData();
        if (!data || data.expiry < Date.now()) {
            data = generateRandomEffects();
            saveRandomEffectsData(data);
            
            io.emit('random-effects-updated', {
                effects: data.effects,
                expiry: data.expiry
            });
        }
        res.json({ success: true, effects: data.effects, expiry: data.expiry });
    } catch (e) {
        console.error('Get random effects error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi tải hiệu ứng ngẫu nhiên' });
    }
});

// ============================================================
// FLASH SALE
// ============================================================
const FLASH_SALE_FILE = path.join(__dirname, 'flash_sale.json');

function getFlashSaleData() {
    try {
        if (fs.existsSync(FLASH_SALE_FILE)) {
            return JSON.parse(fs.readFileSync(FLASH_SALE_FILE, 'utf8'));
        }
    } catch (e) {}
    return null;
}

function saveFlashSaleData(data) {
    fs.writeFileSync(FLASH_SALE_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/store/flash-sale', (req, res) => {
    try {
        const data = getFlashSaleData();
        if (data && data.active && data.expiry > Date.now()) {
            res.json({
                success: true,
                active: true,
                items: data.items || [],
                expiry: data.expiry,
                selectedItems: data.selectedItems || []
            });
        } else {
            if (data && data.active) {
                data.active = false;
                saveFlashSaleData(data);
                io.emit('flash-sale-end', { timestamp: Date.now() });
            }
            res.json({
                success: true,
                active: false,
                items: [],
                expiry: 0,
                selectedItems: data?.selectedItems || []
            });
        }
    } catch (e) {
        console.error('Get flash sale error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi tải Flash Sale' });
    }
});

app.post('/api/store/flash-sale/start', (req, res) => {
    try {
        const { username, items, duration = 2 } = req.body;
        if (!username) {
            return res.status(400).json({ success: false, msg: 'Thiếu username' });
        }
        
        const user = findUserByUsername(username);
        if (!user || user.role !== 'owner') {
            return res.status(403).json({ success: false, msg: 'Chỉ Owner mới có quyền này!' });
        }
        
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, msg: 'Vui lòng chọn ít nhất 1 item' });
        }
        
        if (items.length > 8) {
            return res.status(400).json({ success: false, msg: 'Chỉ được chọn tối đa 8 item' });
        }
        
        const durationHours = parseInt(duration) || 2;
        if (durationHours < 1 || durationHours > 24) {
            return res.status(400).json({ success: false, msg: 'Thời gian phải từ 1 đến 24 giờ' });
        }
        
        // Format items with discount, quantity, duration from config
        const formattedItems = items.map(item => {
            const discount = item.discount || 30;
            const quantity = item.quantity || 1;
            const originalPrice = item.price || 25000;
            return {
                ...item,
                discount: discount,
                originalPrice: originalPrice,
                icon: item.icon || '✨',
                quantity: quantity,
                duration: item.duration || durationHours
            };
        });
        
        const expiry = Date.now() + durationHours * 60 * 60 * 1000;
        
        const data = {
            active: true,
            items: formattedItems,
            expiry: expiry,
            duration: durationHours,
            selectedItems: items.map(i => ({ 
                key: i.key, 
                type: i.type, 
                discount: i.discount || 30,
                quantity: i.quantity || 1,
                duration: i.duration || durationHours
            }))
        };
        
        saveFlashSaleData(data);
        
        io.emit('flash-sale-start', {
            items: formattedItems,
            expiry: expiry,
            duration: durationHours,
            timestamp: Date.now()
        });
        
        updateUser(username, { flashSaleSelected: items });
        
        res.json({
            success: true,
            msg: `Flash Sale đã được bắt đầu! (${durationHours} giờ)`,
            items: formattedItems,
            expiry: expiry,
            duration: durationHours
        });
    } catch (e) {
        console.error('Start flash sale error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi bắt đầu Flash Sale: ' + e.message });
    }
});

app.post('/api/store/flash-sale/clear', (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ success: false, msg: 'Thiếu username' });
        }
        
        const user = findUserByUsername(username);
        if (!user || user.role !== 'owner') {
            return res.status(403).json({ success: false, msg: 'Chỉ Owner mới có quyền này!' });
        }
        
        const data = getFlashSaleData();
        if (data) {
            data.active = false;
            data.items = [];
            data.selectedItems = [];
            data.duration = 0;
            saveFlashSaleData(data);
        }
        
        updateUser(username, { flashSaleSelected: [] });
        
        io.emit('flash-sale-end', { timestamp: Date.now() });
        
        res.json({ success: true, msg: 'Đã xóa Flash Sale!' });
    } catch (e) {
        console.error('Clear flash sale error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi xóa Flash Sale' });
    }
});

// ============================================================
// ADMIN ROUTES
// ============================================================
app.get('/api/admin/users', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ success: false, msg: 'Vui lòng đăng nhập.' });
    }
    
    const allowedRoles = ['support', 'manager', 'admin', 'owner'];
    if (!allowedRoles.includes(req.session.user.role)) {
        return res.status(403).json({ success: false, msg: 'Không có quyền truy cập.' });
    }
    
    try {
        const search = req.query.search || '';
        let users = getUsers();
        if (search.trim()) {
            const s = search.trim().toLowerCase();
            users = users.filter(u => 
                u.username.toLowerCase().includes(s) || 
                (u.displayName && u.displayName.toLowerCase().includes(s)) ||
                u.email.toLowerCase().includes(s)
            );
        }
        const isOwnerUser = isOwner(req.session.user);
        res.json(users.map(u => ({
            username: u.username,
            displayName: u.displayName || u.username,
            role: u.role || 'user',
            tier: u.tier || 'user',
            email: u.email,
            password: isOwnerUser ? u.password : undefined,
            cash: u.cash || 0,
            totalTopup: u.totalTopup || 0,
            effects: u.effects || [],
            themes: u.themes || [],
            badges: u.badges || [],
            frames: u.frames || ['default'],
            gradientText: u.gradientText || false,
            typingEffect: u.typingEffect || false,
            avatarFrames: u.avatarFrames || ['default'],
            highlightedName: u.highlightedName || false,
            avatarUrl: u.avatarUrl || null,
            msgColor: u.msgColor || '#6C2BD9',
            seasonTier: u.seasonTier || 0,
            seasonIsElite: u.seasonIsElite || false,
            vipActive: u.vipActive || false,
            vipExpiry: u.vipExpiry || null
        })));
    } catch (e) {
        console.error('Admin users error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi tải danh sách user' });
    }
});

app.get('/api/admin/user/:username', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ success: false, msg: 'Vui lòng đăng nhập.' });
    }
    
    const allowedRoles = ['support', 'manager', 'admin', 'owner'];
    if (!allowedRoles.includes(req.session.user.role)) {
        return res.status(403).json({ success: false, msg: 'Không có quyền truy cập.' });
    }
    
    try {
        const user = findUserByUsername(req.params.username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }
        const isOwnerUser = isOwner(req.session.user);
        res.json({
            username: user.username,
            displayName: user.displayName || user.username,
            email: user.email,
            password: isOwnerUser ? user.password : undefined,
            role: user.role || 'user',
            tier: user.tier || 'user',
            tierExpiry: user.tierExpiry || null,
            cash: user.cash || 0,
            totalTopup: user.totalTopup || 0,
            effects: user.effects || [],
            themes: user.themes || [],
            badges: user.badges || [],
            frames: user.frames || ['default'],
            gradientText: user.gradientText || false,
            typingEffect: user.typingEffect || false,
            avatarFrames: user.avatarFrames || ['default'],
            highlightedName: user.highlightedName || false,
            avatarUrl: user.avatarUrl || null,
            msgColor: user.msgColor || '#6C2BD9',
            createdAt: user.createdAt || null,
            seasonTier: user.seasonTier || 0,
            seasonIsElite: user.seasonIsElite || false,
            vipActive: user.vipActive || false,
            vipExpiry: user.vipExpiry || null
        });
    } catch (e) {
        console.error('Get user detail error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi tải thông tin user' });
    }
});

app.post('/api/admin/update-role', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ success: false, msg: 'Vui lòng đăng nhập.' });
    }
    if (!isOwner(req.session.user)) {
        return res.status(403).json({ success: false, msg: 'Chỉ Owner mới có quyền thay đổi chức vụ.' });
    }
    try {
        const { username, role } = req.body;
        if (!username || !role) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        const validRoles = ['owner', 'admin', 'manager', 'support', 'user'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, msg: 'Chức vụ không hợp lệ.' });
        }
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }
        if (user.role === 'owner' && user.username !== req.session.user.username) {
            return res.status(403).json({ success: false, msg: 'Không thể thay đổi chức vụ của Owner khác.' });
        }
        const updated = updateUser(username, { role });
        if (updated) {
            io.emit('user-updated', {
                username,
                type: 'role_change',
                role,
                fullUser: updated,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username,
                timestamp: Date.now()
            });
            res.json({ success: true, msg: `Đã cập nhật chức vụ cho ${username} thành ${role}.` });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật chức vụ.' });
        }
    } catch (e) {
        console.error('Update role error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi cập nhật chức vụ: ' + e.message });
    }
});

app.post('/api/admin/change-password', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ success: false, msg: 'Vui lòng đăng nhập.' });
    }
    if (!isOwner(req.session.user)) {
        return res.status(403).json({ success: false, msg: 'Chỉ Owner mới có quyền đổi mật khẩu.' });
    }
    try {
        const { username, newPassword } = req.body;
        if (!username || !newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, msg: 'Mật khẩu mới tối thiểu 6 ký tự.' });
        }
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }
        const updated = updateUser(username, { password: newPassword });
        if (updated) {
            io.emit('user-updated', {
                username,
                type: 'password_change',
                timestamp: Date.now()
            });
            res.json({ success: true, msg: `Đã đổi mật khẩu cho ${username}.` });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi đổi mật khẩu.' });
        }
    } catch (e) {
        console.error('Change password error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi đổi mật khẩu: ' + e.message });
    }
});

// ============================================================
// ADMIN GIFT
// ============================================================
app.post('/api/admin/gift', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ success: false, msg: 'Vui lòng đăng nhập.' });
    }
    
    const allowedRoles = ['support', 'manager', 'admin', 'owner'];
    if (!allowedRoles.includes(req.session.user.role)) {
        return res.status(403).json({ success: false, msg: 'Không có quyền truy cập.' });
    }
    
    try {
        const { username, type, itemKey } = req.body;
        console.log(`📦 Admin gift: ${type} ${itemKey} -> ${username} by ${req.session.user.role}`);
        
        if (!username || !type) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        
        const targetUser = findUserByUsername(username);
        if (!targetUser) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }

        let updated = false;
        let resultMsg = '';
        let updatedData = {};
        let freshUser = null;
        let oldCash = targetUser.cash || 0;
        let cashAmount = 0;

        if (type === 'rank') {
            const allRanks = ['bronze','silver','gold','platinum','diamond','vip','legend'];
            if (!allRanks.includes(itemKey)) {
                return res.status(400).json({ success: false, msg: 'Rank không hợp lệ.' });
            }
            const expiry = new Date(Date.now() + 7*24*60*60*1000).toISOString();
            freshUser = updateUser(username, { tier: itemKey, tierExpiry: expiry });
            if (freshUser) {
                updateBadges(username);
                resultMsg = `✅ Đã tặng rank ${itemKey.toUpperCase()} cho ${username}.`;
                updated = true;
                updatedData = { tier: itemKey, tierExpiry: expiry };
            }
        }
        else if (type === 'effect') {
            const allEffects = ['twinkle','shimmer','glow','bubble','explode','rainbow','fire','dragon','aurora','starlight','galaxy'];
            if (!allEffects.includes(itemKey)) {
                return res.status(400).json({ success: false, msg: 'Hiệu ứng không hợp lệ.' });
            }
            let effects = targetUser.effects || [];
            if (effects.includes(itemKey)) {
                return res.status(400).json({ success: false, msg: `${username} đã có hiệu ứng này.` });
            }
            effects.push(itemKey);
            freshUser = updateUser(username, { effects });
            if (freshUser) {
                updateBadges(username);
                resultMsg = `✅ Đã tặng hiệu ứng ${itemKey} cho ${username}.`;
                updated = true;
                updatedData = { effects: effects };
            }
        }
        else if (type === 'theme') {
            const allThemes = ['default','theme1','theme2','theme3','theme4','theme5','theme6','theme7'];
            if (!allThemes.includes(itemKey)) {
                return res.status(400).json({ success: false, msg: 'Theme không hợp lệ.' });
            }
            let themes = targetUser.themes || ['default'];
            if (themes.includes(itemKey)) {
                return res.status(400).json({ success: false, msg: `${username} đã có theme này.` });
            }
            themes.push(itemKey);
            freshUser = updateUser(username, { themes });
            if (freshUser) {
                resultMsg = `✅ Đã tặng theme ${itemKey} cho ${username}.`;
                updated = true;
                updatedData = { themes: themes };
            }
        }
        else if (type === 'cash') {
            const amount = parseInt(itemKey);
            if (isNaN(amount) || amount <= 0) {
                return res.status(400).json({ success: false, msg: 'Số tiền không hợp lệ.' });
            }
            cashAmount = amount;
            const newCash = (targetUser.cash || 0) + amount;
            const newTotalTopup = (targetUser.totalTopup || 0) + amount;
            freshUser = updateUser(username, { cash: newCash, totalTopup: newTotalTopup });
            if (freshUser) {
                updateBadges(username);
                resultMsg = `✅ Đã tặng ${amount.toLocaleString()} 💵 cho ${username}.`;
                updated = true;
                updatedData = { cash: newCash, totalTopup: newTotalTopup };
            }
        }
        else if (type === 'frame') {
            const allFrames = ['default','frame1','frame2','frame3','frame4','frame5','frame6','frame7'];
            if (!allFrames.includes(itemKey)) {
                return res.status(400).json({ success: false, msg: 'Frame không hợp lệ.' });
            }
            let frames = targetUser.frames || ['default'];
            if (frames.includes(itemKey)) {
                return res.status(400).json({ success: false, msg: `${username} đã có frame này.` });
            }
            frames.push(itemKey);
            freshUser = updateUser(username, { frames });
            if (freshUser) {
                resultMsg = `✅ Đã tặng frame ${itemKey} cho ${username}.`;
                updated = true;
                updatedData = { frames: frames };
            }
        }
        else if (type === 'avatarframe') {
            const allAvatarFrames = ['default','avtframe1','avtframe2','avtframe3','avtframe4','avtframe5','avtframe6'];
            if (!allAvatarFrames.includes(itemKey)) {
                return res.status(400).json({ success: false, msg: 'Khung avatar không hợp lệ.' });
            }
            let avatarFrames = targetUser.avatarFrames || ['default'];
            if (avatarFrames.includes(itemKey)) {
                return res.status(400).json({ success: false, msg: `${username} đã có khung avatar này.` });
            }
            avatarFrames.push(itemKey);
            freshUser = updateUser(username, { avatarFrames });
            if (freshUser) {
                resultMsg = `✅ Đã tặng khung avatar ${itemKey} cho ${username}.`;
                updated = true;
                updatedData = { avatarFrames: avatarFrames };
            }
        }
        else if (type === 'gradient') {
            if (targetUser.gradientText) {
                return res.status(400).json({ success: false, msg: `${username} đã có Gradient Text.` });
            }
            freshUser = updateUser(username, { gradientText: true });
            if (freshUser) {
                resultMsg = `✅ Đã kích hoạt Gradient Text cho ${username}.`;
                updated = true;
                updatedData = { gradientText: true };
            }
        }
        else if (type === 'typing') {
            if (targetUser.typingEffect) {
                return res.status(400).json({ success: false, msg: `${username} đã có Typing Effect.` });
            }
            freshUser = updateUser(username, { typingEffect: true });
            if (freshUser) {
                resultMsg = `✅ Đã kích hoạt Typing Effect cho ${username}.`;
                updated = true;
                updatedData = { typingEffect: true };
            }
        }
        else if (type === 'highlight') {
            if (targetUser.highlightedName) {
                return res.status(400).json({ success: false, msg: `${username} đã có Highlighted Name.` });
            }
            freshUser = updateUser(username, { highlightedName: true });
            if (freshUser) {
                resultMsg = `✅ Đã kích hoạt Highlighted Name cho ${username}.`;
                updated = true;
                updatedData = { highlightedName: true };
            }
        } else {
            return res.status(400).json({ success: false, msg: 'Loại quà không hợp lệ.' });
        }

        if (updated && freshUser) {
            console.log(`✅ Admin gift success: ${resultMsg}`);
            
            const giftTypeLabels = {
                'rank': `Rank ${itemKey.toUpperCase()}`,
                'effect': `Hiệu ứng ${itemKey}`,
                'theme': `Theme ${itemKey}`,
                'cash': `${cashAmount.toLocaleString()} 💵`,
                'frame': `Frame ${itemKey}`,
                'avatarframe': `Khung avatar ${itemKey}`,
                'gradient': 'Gradient Text',
                'typing': 'Typing Effect',
                'highlight': 'Highlighted Name'
            };
            
            addNotification(username, 'gift_received', {
                from: req.session.user.username,
                type: type,
                item: itemKey,
                itemLabel: giftTypeLabels[type] || itemKey,
                message: `${req.session.user.username} đã tặng bạn ${giftTypeLabels[type] || itemKey}`
            });
            
            io.emit('user-updated', {
                username: username,
                type: type,
                itemKey: itemKey,
                data: updatedData,
                fullUser: freshUser,
                timestamp: Date.now()
            });
            
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
            
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('user-updated', {
                    username: username,
                    type: type,
                    itemKey: itemKey,
                    data: updatedData,
                    fullUser: freshUser,
                    timestamp: Date.now()
                });
                io.to(targetSocketId).emit('force-refresh-user', {
                    username: username,
                    timestamp: Date.now()
                });
                
                if (type === 'cash') {
                    io.to(targetSocketId).emit('cash-updated', {
                        username: username,
                        newCash: freshUser.cash,
                        amount: cashAmount,
                        oldCash: oldCash,
                        timestamp: Date.now()
                    });
                    console.log(`💰 Cash updated realtime for ${username}: ${oldCash} -> ${freshUser.cash}`);
                }
                
                io.to(targetSocketId).emit('force-update-sidebar', {
                    username: username,
                    timestamp: Date.now()
                });
            }
            
            if (req.session.user.username === username) {
                req.session.user = {
                    ...req.session.user,
                    ...freshUser
                };
            }
            
            checkAndUnlockAchievements(username);
            
            return res.json({ 
                success: true, 
                msg: resultMsg,
                user: freshUser
            });
        } else {
            return res.status(500).json({ success: false, msg: 'Không thể cập nhật user.' });
        }
    } catch (e) {
        console.error('Admin gift error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi gửi quà: ' + e.message });
    }
});

// ============================================================
// STORE
// ============================================================
const STORE_FILE = path.join(__dirname, 'store_items.json');
const STORE_INTERVAL = 3 * 60 * 60 * 1000;

const ALL_EFFECTS = [
    { key: 'twinkle', label: 'Lấp lánh', icon: '✨', tier: 'pro' },
    { key: 'shimmer', label: 'Sáng bóng', icon: '💫', tier: 'pro' },
    { key: 'glow', label: 'Chói lóa', icon: '🌟', tier: 'pro' },
    { key: 'bubble', label: 'Bong bóng', icon: '🫧', tier: 'promax' },
    { key: 'explode', label: 'Nổ', icon: '💥', tier: 'promax' },
    { key: 'rainbow', label: 'Cầu vồng', icon: '🌈', tier: 'promax' },
    { key: 'fire', label: 'Lửa', icon: '🔥', tier: 'promax' },
    { key: 'dragon', label: 'Rồng cuộn', icon: '🐉', tier: 'promax' }
];

const RANK_PRICES = {
    'bronze': 20000,
    'silver': 35000,
    'gold': 60000,
    'platinum': 80000,
    'diamond': 120000,
    'vip': 200000,
    'legend': 500000
};

const THEME_PRICES = {
    'theme1': 20000,
    'theme2': 20000,
    'theme3': 20000,
    'theme4': 20000,
    'theme5': 20000
};

const FRAME_PRICES = {
    'frame1': 15000,
    'frame2': 15000,
    'frame3': 20000,
    'frame4': 15000,
    'frame5': 18000,
    'frame6': 25000,
    'frame7': 30000
};

const AVATAR_FRAME_PRICES = {
    'avtframe1': 12000,
    'avtframe2': 15000,
    'avtframe3': 18000,
    'avtframe4': 22000,
    'avtframe5': 28000,
    'avtframe6': 35000
};

function generateStoreItems() {
    const shuffled = [...ALL_EFFECTS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    return selected.map(effect => {
        let price = 20000 + Math.floor(Math.random() * 30000);
        if (effect.tier === 'legend') price = 50000;
        else if (effect.tier === 'vip') price = 40000;
        else if (effect.tier === 'diamond') price = 35000;
        else if (effect.tier === 'platinum') price = 30000;
        else if (effect.tier === 'gold') price = 25000;
        else if (effect.tier === 'silver') price = 20000;
        else if (effect.tier === 'promax') price = 30000;
        else if (effect.tier === 'pro') price = 25000;
        else price = 18000;
        return {
            key: effect.key,
            label: effect.label,
            icon: effect.icon,
            price: price,
            tier: effect.tier
        };
    });
}

function getStoreItems() {
    try {
        if (fs.existsSync(STORE_FILE)) {
            const data = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
            if (data.expiry && data.expiry > Date.now()) {
                return { items: data.items, expiry: data.expiry };
            }
        }
    } catch (e) {}
    const items = generateStoreItems();
    const expiry = Date.now() + STORE_INTERVAL;
    fs.writeFileSync(STORE_FILE, JSON.stringify({ items, expiry }, null, 2));
    return { items, expiry };
}

app.post('/api/store/refresh', (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ success: false, msg: 'Thiếu username' });
        }
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại' });
        }
        if ((user.refreshTokens || 0) <= 0) {
            return res.status(400).json({ success: false, msg: 'Không có token refresh' });
        }
        const newTokens = (user.refreshTokens || 0) - 1;
        const updated = updateUser(username, { refreshTokens: newTokens });
        const items = generateStoreItems();
        const expiry = Date.now() + STORE_INTERVAL;
        fs.writeFileSync(STORE_FILE, JSON.stringify({ items, expiry }, null, 2));
        io.emit('user-updated', { 
            username, 
            type: 'store_refresh',
            fullUser: updated,
            timestamp: Date.now()
        });
        io.emit('force-refresh-user', {
            username: username,
            timestamp: Date.now()
        });
        res.json({ success: true, msg: 'Đã refresh cửa hàng', store: { items, expiry } });
    } catch (e) {
        res.status(500).json({ success: false, msg: 'Lỗi refresh store' });
    }
});

app.get('/api/store/items', (req, res) => {
    try { 
        res.json(getStoreItems()); 
    } catch (e) { 
        res.json({ items: generateStoreItems(), expiry: Date.now() + STORE_INTERVAL }); 
    }
});

// ============================================================
// CONSTANTS - EFFECT ITEMS (Thêm vào sau phần constants hiện có)
// ============================================================

// Thêm EFFECT_ITEMS - Tất cả effect có trong store
const EFFECT_ITEMS = {
    'twinkle': { label: 'Lấp lánh', icon: '✨', price: 25000, vip: false },
    'shimmer': { label: 'Sáng bóng', icon: '💫', price: 28000, vip: false },
    'glow': { label: 'Chói lóa', icon: '🌟', price: 30000, vip: false },
    'bubble': { label: 'Bong bóng', icon: '🫧', price: 25000, vip: false },
    'explode': { label: 'Nổ', icon: '💥', price: 35000, vip: false },
    'rainbow': { label: 'Cầu vồng', icon: '🌈', price: 35000, vip: false },
    'fire': { label: 'Lửa', icon: '🔥', price: 30000, vip: false },
    'dragon': { label: 'Rồng cuộn', icon: '🐉', price: 40000, vip: false },
    'aurora': { label: 'Cực quang', icon: '🌌', price: 45000, vip: true },
    'starlight': { label: 'Ánh sao', icon: '⭐', price: 40000, vip: true },
    'galaxy': { label: 'Thiên hà', icon: '🌠', price: 50000, vip: true }
};

// ============================================================
// GET RANK DISCOUNT (Thêm sau EFFECT_ITEMS)
// ============================================================
function getRankDiscount(tier) {
    const discounts = {
        'bronze': 5,
        'silver': 10,
        'gold': 15,
        'platinum': 20,
        'diamond': 20,
        'vip': 25,
        'legend': 35,
        'user': 0
    };
    return discounts[tier] || 0;
}

// ============================================================
// STORE BUY FUNCTIONS
// ============================================================
app.post('/api/store/buy-rank', (req, res) => {
    try {
        const { username, rankKey } = req.body;
        if (!username || !rankKey) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }
        
        const tierLevels = ['user', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'vip', 'legend'];
        const currentLevel = tierLevels.indexOf(user.tier || 'user');
        const targetLevel = tierLevels.indexOf(rankKey);
        
        if (targetLevel <= currentLevel) {
            return res.status(400).json({ success: false, msg: 'Bạn đã có rank này hoặc cao hơn.' });
        }
        
        const price = RANK_PRICES[rankKey];
        if (!price) {
            return res.status(400).json({ success: false, msg: 'Rank không hợp lệ.' });
        }
        
        if (user.cash < price) {
            return res.status(400).json({ success: false, msg: `Không đủ 💵. Cần ${price.toLocaleString()} 💵` });
        }
        
        const expiry = new Date(Date.now() + 7*24*60*60*1000).toISOString();
        const newCash = user.cash - price;
        const newTotalTopup = (user.totalTopup || 0) + price;
        
        const updated = updateUser(username, { 
            tier: rankKey, 
            tierExpiry: expiry, 
            cash: newCash,
            totalTopup: newTotalTopup
        });
        
        if (updated) {
            updateBadges(username);
            
            io.emit('user-updated', { 
                username, 
                type: 'store_buy', 
                item: 'rank',
                itemKey: rankKey,
                fullUser: updated,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
            
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: price,
                    timestamp: Date.now()
                });
            }
            
            checkAndUnlockAchievements(username);
            
            res.json({ 
                success: true, 
                msg: `Mua rank ${rankKey.toUpperCase()} thành công!`, 
                cash: newCash, 
                tier: rankKey,
                tierExpiry: expiry,
                user: updated 
            });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật user.' });
        }
    } catch (e) {
        console.error('Buy rank error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi mua rank: ' + e.message });
    }
});

// ============================================================
// BUY EFFECT - FIXED (Không cần trong storeItems)
// ============================================================
app.post('/api/store/buy-effect', (req, res) => {
    try {
        const { username, effectKey } = req.body;
        if (!username || !effectKey) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }
        
        // Lấy thông tin effect từ EFFECT_ITEMS
        const effectInfo = EFFECT_ITEMS[effectKey];
        if (!effectInfo) {
            return res.status(404).json({ success: false, msg: 'Hiệu ứng không tồn tại.' });
        }
        
        // VIP EFFECTS CHECK
        if (effectInfo.vip) {
            const vipActive = user.vipActive || false;
            if (!vipActive) {
                return res.status(403).json({ 
                    success: false, 
                    msg: '👑 Vật phẩm này chỉ dành cho VIP!' 
                });
            }
        }
        
        const effects = user.effects || [];
        if (effects.includes(effectKey)) {
            return res.status(400).json({ success: false, msg: 'Bạn đã có hiệu ứng này.' });
        }
        
        const price = effectInfo.price || 25000;
        
        // Tính giảm giá theo rank và VIP
        let discountPercent = getRankDiscount(user.tier || 'user');
        if (user.vipActive) discountPercent += 20;
        let finalPrice = price;
        if (discountPercent > 0) {
            finalPrice = Math.floor(price * (1 - discountPercent / 100));
        }
        
        if (finalPrice > 0 && user.cash < finalPrice) {
            return res.status(400).json({ success: false, msg: `Không đủ 💵. Cần ${finalPrice.toLocaleString()} 💵` });
        }
        
        const newCash = (user.cash || 0) - finalPrice;
        effects.push(effectKey);
        
        const updated = updateUser(username, { effects, cash: newCash });
        if (updated) {
            updateBadges(username);
            
            io.emit('user-updated', { 
                username, 
                type: 'store_buy', 
                item: 'effect',
                itemKey: effectKey,
                fullUser: updated,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
            
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: finalPrice,
                    timestamp: Date.now()
                });
            }
            
            checkAndUnlockAchievements(username);
            
            res.json({ 
                success: true, 
                msg: `Mua hiệu ứng ${effectInfo.label} thành công!`, 
                cash: newCash, 
                user: updated 
            });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật user.' });
        }
    } catch (e) {
        console.error('Buy effect error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi mua hiệu ứng: ' + e.message });
    }
});

app.post('/api/store/buy-theme', (req, res) => {
    try {
        const { username, themeKey } = req.body;
        if (!username || !themeKey) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }
        
        const themes = user.themes || ['default'];
        if (themes.includes(themeKey)) {
            return res.status(400).json({ success: false, msg: 'Bạn đã có theme này.' });
        }
        
        let price = 0;
        if (themeKey !== 'default' && themeKey !== 'theme6' && themeKey !== 'theme7') {
            price = THEME_PRICES[themeKey] || 20000;
        }
        
        if (price > 0 && user.cash < price) {
            return res.status(400).json({ success: false, msg: `Không đủ 💵. Cần ${price.toLocaleString()} 💵` });
        }
        
        themes.push(themeKey);
        const newCash = user.cash - price;
        const updateData = { themes };
        if (price > 0) updateData.cash = newCash;
        
        const updated = updateUser(username, updateData);
        if (updated) {
            io.emit('user-updated', { 
                username, 
                type: 'store_buy', 
                item: 'theme',
                itemKey: themeKey,
                fullUser: updated,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
            
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: price,
                    timestamp: Date.now()
                });
            }
            
            checkAndUnlockAchievements(username);
            
            res.json({ success: true, msg: `Mua theme thành công!`, cash: newCash, user: updated });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật user.' });
        }
    } catch (e) {
        console.error('Buy theme error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi mua theme: ' + e.message });
    }
});

app.post('/api/store/buy-frame', (req, res) => {
    try {
        const { username, frameKey } = req.body;
        if (!username || !frameKey) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }
        
        // VIP frames check
        const vipFrames = ['frame6', 'frame7'];
        if (vipFrames.includes(frameKey)) {
            const vipActive = user.vipActive || false;
            if (!vipActive) {
                return res.status(403).json({ 
                    success: false, 
                    msg: '👑 Vật phẩm này chỉ dành cho VIP!' 
                });
            }
        }
        
        const frames = user.frames || ['default'];
        if (frames.includes(frameKey)) {
            return res.status(400).json({ success: false, msg: 'Bạn đã có frame này.' });
        }
        
        let price = 0;
        if (frameKey !== 'default') {
            price = FRAME_PRICES[frameKey] || 15000;
        }
        
        if (price > 0 && user.cash < price) {
            return res.status(400).json({ success: false, msg: `Không đủ 💵. Cần ${price.toLocaleString()} 💵` });
        }
        
        frames.push(frameKey);
        const newCash = user.cash - price;
        const updateData = { frames };
        if (price > 0) updateData.cash = newCash;
        
        const updated = updateUser(username, updateData);
        if (updated) {
            io.emit('user-updated', { 
                username, 
                type: 'store_buy', 
                item: 'frame',
                itemKey: frameKey,
                fullUser: updated,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
            
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: price,
                    timestamp: Date.now()
                });
            }
            
            checkAndUnlockAchievements(username);
            
            res.json({ success: true, msg: `Mua frame thành công!`, cash: newCash, user: updated });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật user.' });
        }
    } catch (e) {
        console.error('Buy frame error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi mua frame: ' + e.message });
    }
});

app.post('/api/store/buy-avatarframe', (req, res) => {
    try {
        const { username, frameKey } = req.body;
        if (!username || !frameKey) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }
        
        // VIP avatar frames check
        const vipAvatarFrames = ['avtframe4', 'avtframe5', 'avtframe6'];
        if (vipAvatarFrames.includes(frameKey)) {
            const vipActive = user.vipActive || false;
            if (!vipActive) {
                return res.status(403).json({ 
                    success: false, 
                    msg: '👑 Vật phẩm này chỉ dành cho VIP!' 
                });
            }
        }
        
        const avatarFrames = user.avatarFrames || ['default'];
        if (avatarFrames.includes(frameKey)) {
            return res.status(400).json({ success: false, msg: 'Bạn đã có khung avatar này.' });
        }
        
        let price = 0;
        if (frameKey !== 'default') {
            price = AVATAR_FRAME_PRICES[frameKey] || 12000;
        }
        
        if (price > 0 && user.cash < price) {
            return res.status(400).json({ success: false, msg: `Không đủ 💵. Cần ${price.toLocaleString()} 💵` });
        }
        
        avatarFrames.push(frameKey);
        const newCash = user.cash - price;
        const updateData = { avatarFrames };
        if (price > 0) updateData.cash = newCash;
        
        const updated = updateUser(username, updateData);
        if (updated) {
            io.emit('user-updated', { 
                username, 
                type: 'store_buy', 
                item: 'avatarframe',
                itemKey: frameKey,
                fullUser: updated,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
            
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: price,
                    timestamp: Date.now()
                });
            }
            
            checkAndUnlockAchievements(username);
            
            res.json({ success: true, msg: `Mua khung avatar thành công!`, cash: newCash, user: updated });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật user.' });
        }
    } catch (e) {
        console.error('Buy avatar frame error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi mua khung avatar: ' + e.message });
    }
});

app.post('/api/store/buy-gradient', (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }
        
        if (user.gradientText) {
            return res.status(400).json({ success: false, msg: 'Bạn đã có Gradient Text.' });
        }
        
        const price = 20000;
        if (user.cash < price) {
            return res.status(400).json({ success: false, msg: `Không đủ 💵. Cần ${price.toLocaleString()} 💵` });
        }
        
        const newCash = user.cash - price;
        const updated = updateUser(username, { gradientText: true, cash: newCash });
        if (updated) {
            io.emit('user-updated', { 
                username, 
                type: 'store_buy', 
                item: 'gradient',
                fullUser: updated,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
            
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: price,
                    timestamp: Date.now()
                });
            }
            
            checkAndUnlockAchievements(username);
            
            res.json({ success: true, msg: `Mua Gradient Text thành công!`, cash: newCash, user: updated });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật user.' });
        }
    } catch (e) {
        console.error('Buy gradient error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi mua gradient: ' + e.message });
    }
});

app.post('/api/store/buy-typing', (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }
        
        if (user.typingEffect) {
            return res.status(400).json({ success: false, msg: 'Bạn đã có Typing Effect.' });
        }
        
        const price = 8000;
        if (user.cash < price) {
            return res.status(400).json({ success: false, msg: `Không đủ 💵. Cần ${price.toLocaleString()} 💵` });
        }
        
        const newCash = user.cash - price;
        const updated = updateUser(username, { typingEffect: true, cash: newCash });
        if (updated) {
            io.emit('user-updated', { 
                username, 
                type: 'store_buy', 
                item: 'typing',
                fullUser: updated,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
            
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: price,
                    timestamp: Date.now()
                });
            }
            
            checkAndUnlockAchievements(username);
            
            res.json({ success: true, msg: `Mua Typing Effect thành công!`, cash: newCash, user: updated });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật user.' });
        }
    } catch (e) {
        console.error('Buy typing error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi mua typing: ' + e.message });
    }
});

app.post('/api/store/buy-highlight', (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }
        
        if (user.highlightedName) {
            return res.status(400).json({ success: false, msg: 'Bạn đã có Highlighted Name.' });
        }
        
        const price = 18000;
        if (user.cash < price) {
            return res.status(400).json({ success: false, msg: `Không đủ 💵. Cần ${price.toLocaleString()} 💵` });
        }
        
        const newCash = user.cash - price;
        const updated = updateUser(username, { highlightedName: true, cash: newCash });
        if (updated) {
            io.emit('user-updated', { 
                username, 
                type: 'store_buy', 
                item: 'highlight',
                fullUser: updated,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
            
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: price,
                    timestamp: Date.now()
                });
            }
            
            checkAndUnlockAchievements(username);
            
            res.json({ success: true, msg: `Mua Highlighted Name thành công!`, cash: newCash, user: updated });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật user.' });
        }
    } catch (e) {
        console.error('Buy highlight error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi mua highlight: ' + e.message });
    }
});

// ============================================================
// SELL FUNCTIONS
// ============================================================
app.post('/api/store/sell', (req, res) => {
    try {
        const { username, itemKey, isRank } = req.body;
        if (!username || !itemKey) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }
        
        if (user.seasonEffectsExpiry && user.seasonEffectsExpiry[itemKey]) {
            return res.status(400).json({ 
                success: false, 
                msg: '⚠️ Vật phẩm này nhận từ Season Pass, không thể bán!' 
            });
        }
        
        const effects = user.effects || [];
        if (!effects.includes(itemKey)) {
            return res.status(400).json({ success: false, msg: 'Bạn không có hiệu ứng này.' });
        }
        
        const storeData = getStoreItems();
        const item = storeData.items.find(i => i.key === itemKey);
        if (!item) {
            return res.status(404).json({ success: false, msg: 'Không tìm thấy hiệu ứng.' });
        }
        
        const sellPrice = Math.floor(item.price * 0.5);
        const newEffects = effects.filter(e => e !== itemKey);
        const newCash = (user.cash || 0) + sellPrice;
        
        const updated = updateUser(username, { effects: newEffects, cash: newCash });
        if (updated) {
            io.emit('user-updated', { 
                username, 
                type: 'store_sell', 
                item: 'effect',
                itemKey: itemKey,
                fullUser: updated,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
            
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: sellPrice,
                    timestamp: Date.now()
                });
            }
            
            checkAndUnlockAchievements(username);
            
            res.json({ success: true, msg: `Đã bán ${item.label} với giá ${sellPrice.toLocaleString()} 💵`, cash: newCash, user: updated });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật user.' });
        }
    } catch (e) {
        console.error('Sell error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi bán: ' + e.message });
    }
});

app.post('/api/store/sell-theme', (req, res) => {
    try {
        const { username, themeKey } = req.body;
        if (!username || !themeKey) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }
        
        if (themeKey === 'default' || themeKey === 'theme6' || themeKey === 'theme7') {
            return res.status(400).json({ success: false, msg: 'Không thể bán theme miễn phí.' });
        }
        
        const themes = user.themes || ['default'];
        if (!themes.includes(themeKey)) {
            return res.status(400).json({ success: false, msg: 'Bạn không có theme này.' });
        }
        
        const price = THEME_PRICES[themeKey] || 20000;
        const sellPrice = Math.floor(price * 0.5);
        const newThemes = themes.filter(t => t !== themeKey);
        const newCash = (user.cash || 0) + sellPrice;
        
        const updated = updateUser(username, { themes: newThemes, cash: newCash });
        if (updated) {
            io.emit('user-updated', { 
                username, 
                type: 'store_sell', 
                item: 'theme',
                itemKey: themeKey,
                fullUser: updated,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
            
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: sellPrice,
                    timestamp: Date.now()
                });
            }
            
            checkAndUnlockAchievements(username);
            
            res.json({ success: true, msg: `Đã bán theme với giá ${sellPrice.toLocaleString()} 💵`, cash: newCash, user: updated });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật user.' });
        }
    } catch (e) {
        console.error('Sell theme error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi bán theme: ' + e.message });
    }
});

app.post('/api/store/sell-frame', (req, res) => {
    try {
        const { username, frameKey } = req.body;
        if (!username || !frameKey) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }
        
        if (frameKey === 'default') {
            return res.status(400).json({ success: false, msg: 'Không thể bán frame mặc định.' });
        }
        
        const frames = user.frames || ['default'];
        if (!frames.includes(frameKey)) {
            return res.status(400).json({ success: false, msg: 'Bạn không có frame này.' });
        }
        
        const price = FRAME_PRICES[frameKey] || 15000;
        const sellPrice = Math.floor(price * 0.5);
        const newFrames = frames.filter(f => f !== frameKey);
        const newCash = (user.cash || 0) + sellPrice;
        
        const updated = updateUser(username, { frames: newFrames, cash: newCash });
        if (updated) {
            io.emit('user-updated', { 
                username, 
                type: 'store_sell', 
                item: 'frame',
                itemKey: frameKey,
                fullUser: updated,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
            
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: sellPrice,
                    timestamp: Date.now()
                });
            }
            
            checkAndUnlockAchievements(username);
            
            res.json({ success: true, msg: `Đã bán frame với giá ${sellPrice.toLocaleString()} 💵`, cash: newCash, user: updated });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật user.' });
        }
    } catch (e) {
        console.error('Sell frame error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi bán frame: ' + e.message });
    }
});

app.post('/api/store/sell-avatarframe', (req, res) => {
    try {
        const { username, frameKey } = req.body;
        if (!username || !frameKey) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User không tồn tại.' });
        }
        
        if (frameKey === 'default') {
            return res.status(400).json({ success: false, msg: 'Không thể bán khung avatar mặc định.' });
        }
        
        const avatarFrames = user.avatarFrames || ['default'];
        if (!avatarFrames.includes(frameKey)) {
            return res.status(400).json({ success: false, msg: 'Bạn không có khung avatar này.' });
        }
        
        const price = AVATAR_FRAME_PRICES[frameKey] || 12000;
        const sellPrice = Math.floor(price * 0.5);
        const newFrames = avatarFrames.filter(f => f !== frameKey);
        const newCash = (user.cash || 0) + sellPrice;
        
        const updated = updateUser(username, { avatarFrames: newFrames, cash: newCash });
        if (updated) {
            io.emit('user-updated', { 
                username, 
                type: 'store_sell', 
                item: 'avatarframe',
                itemKey: frameKey,
                fullUser: updated,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
            
            const targetSocketId = userSockets[username];
            if (targetSocketId) {
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: sellPrice,
                    timestamp: Date.now()
                });
            }
            
            checkAndUnlockAchievements(username);
            
            res.json({ success: true, msg: `Đã bán khung avatar với giá ${sellPrice.toLocaleString()} 💵`, cash: newCash, user: updated });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật user.' });
        }
    } catch (e) {
        console.error('Sell avatar frame error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi bán khung avatar: ' + e.message });
    }
});

// ============================================================
// GIFT STORE ITEM
// ============================================================
app.post('/api/store/gift', (req, res) => {
    try {
        const { username, toUsername, type, itemKey } = req.body;
        if (!username || !toUsername || !type || !itemKey) {
            return res.status(400).json({ success: false, msg: 'Thiếu thông tin.' });
        }
        
        if (username === toUsername) {
            return res.status(400).json({ success: false, msg: 'Không thể tự tặng cho mình.' });
        }
        
        const user = findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'Người gửi không tồn tại.' });
        }
        
        const targetUser = findUserByUsername(toUsername);
        if (!targetUser) {
            return res.status(404).json({ success: false, msg: 'Người nhận không tồn tại.' });
        }
        
        const friends = getFriends(username);
        if (!friends.includes(toUsername)) {
            return res.status(400).json({ success: false, msg: 'Chỉ có thể tặng quà cho bạn bè.' });
        }
        
        let itemPrice = 0;
        let targetData = {};
        let itemLabel = '';
        
        if (type === 'effect') {
            const effects = user.effects || [];
            if (!effects.includes(itemKey)) {
                return res.status(400).json({ success: false, msg: 'Bạn không có hiệu ứng này.' });
            }
            const storeData = getStoreItems();
            const item = storeData.items.find(i => i.key === itemKey);
            if (!item) {
                return res.status(400).json({ success: false, msg: 'Hiệu ứng không tồn tại.' });
            }
            itemPrice = Math.floor(item.price * 0.3);
            targetData = { effects: [...(targetUser.effects || []), itemKey] };
            itemLabel = item.label;
        } else if (type === 'theme') {
            const themes = user.themes || ['default'];
            if (!themes.includes(itemKey)) {
                return res.status(400).json({ success: false, msg: 'Bạn không có theme này.' });
            }
            if (itemKey === 'default' || itemKey === 'theme6' || itemKey === 'theme7') {
                return res.status(400).json({ success: false, msg: 'Không thể tặng theme miễn phí.' });
            }
            itemPrice = Math.floor((THEME_PRICES[itemKey] || 20000) * 0.3);
            targetData = { themes: [...(targetUser.themes || ['default']), itemKey] };
            itemLabel = itemKey;
        } else if (type === 'frame') {
            const frames = user.frames || ['default'];
            if (!frames.includes(itemKey)) {
                return res.status(400).json({ success: false, msg: 'Bạn không có frame này.' });
            }
            if (itemKey === 'default') {
                return res.status(400).json({ success: false, msg: 'Không thể tặng frame mặc định.' });
            }
            itemPrice = Math.floor((FRAME_PRICES[itemKey] || 15000) * 0.3);
            targetData = { frames: [...(targetUser.frames || ['default']), itemKey] };
            itemLabel = itemKey;
        } else if (type === 'avatarframe') {
            const avatarFrames = user.avatarFrames || ['default'];
            if (!avatarFrames.includes(itemKey)) {
                return res.status(400).json({ success: false, msg: 'Bạn không có khung avatar này.' });
            }
            if (itemKey === 'default') {
                return res.status(400).json({ success: false, msg: 'Không thể tặng khung avatar mặc định.' });
            }
            itemPrice = Math.floor((AVATAR_FRAME_PRICES[itemKey] || 12000) * 0.3);
            targetData = { avatarFrames: [...(targetUser.avatarFrames || ['default']), itemKey] };
            itemLabel = itemKey;
        } else {
            return res.status(400).json({ success: false, msg: 'Loại quà không hợp lệ.' });
        }
        
        if (user.cash < itemPrice) {
            return res.status(400).json({ success: false, msg: `Không đủ 💵 để tặng. Cần ${itemPrice.toLocaleString()} 💵` });
        }
        
        const newCash = user.cash - itemPrice;
        const updatedSender = updateUser(username, { cash: newCash });
        
        let targetEffects = targetUser.effects || [];
        let targetThemes = targetUser.themes || ['default'];
        let targetFrames = targetUser.frames || ['default'];
        let targetAvatarFrames = targetUser.avatarFrames || ['default'];
        
        if (type === 'effect') {
            if (!targetEffects.includes(itemKey)) {
                targetEffects.push(itemKey);
            }
            targetData = { effects: targetEffects };
        } else if (type === 'theme') {
            if (!targetThemes.includes(itemKey)) {
                targetThemes.push(itemKey);
            }
            targetData = { themes: targetThemes };
        } else if (type === 'frame') {
            if (!targetFrames.includes(itemKey)) {
                targetFrames.push(itemKey);
            }
            targetData = { frames: targetFrames };
        } else if (type === 'avatarframe') {
            if (!targetAvatarFrames.includes(itemKey)) {
                targetAvatarFrames.push(itemKey);
            }
            targetData = { avatarFrames: targetAvatarFrames };
        }
        
        const updatedTarget = updateUser(toUsername, targetData);
        
        if (updatedSender && updatedTarget) {
            addNotification(toUsername, 'gift_received', {
                from: username,
                type: type,
                item: itemKey,
                itemLabel: itemLabel,
                message: `${username} đã tặng bạn ${itemLabel}`
            });
            
            io.emit('user-updated', {
                username: username,
                type: 'gift_sent',
                fullUser: updatedSender,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: username,
                timestamp: Date.now()
            });
            
            io.emit('user-updated', {
                username: toUsername,
                type: 'gift_received',
                fullUser: updatedTarget,
                item: itemLabel,
                from: username,
                timestamp: Date.now()
            });
            io.emit('force-refresh-user', {
                username: toUsername,
                timestamp: Date.now()
            });
            
            const targetSocketId = userSockets[toUsername];
            if (targetSocketId) {
                io.to(targetSocketId).emit('force-refresh-user', {
                    username: toUsername,
                    timestamp: Date.now()
                });
                io.to(targetSocketId).emit('user-updated', {
                    username: toUsername,
                    type: 'gift_received',
                    fullUser: updatedTarget,
                    item: itemLabel,
                    from: username,
                    timestamp: Date.now()
                });
                io.to(targetSocketId).emit('cash-updated', {
                    username: username,
                    newCash: newCash,
                    amount: itemPrice,
                    timestamp: Date.now()
                });
            }
            
            checkAndUnlockAchievements(username);
            checkAndUnlockAchievements(toUsername);
            
            res.json({ 
                success: true, 
                msg: `Đã tặng ${itemLabel} cho ${toUsername} thành công! (Phí ${itemPrice.toLocaleString()} 💵)`,
                cash: newCash,
                user: updatedSender
            });
        } else {
            res.status(500).json({ success: false, msg: 'Lỗi cập nhật user.' });
        }
    } catch (e) {
        console.error('Gift error:', e);
        res.status(500).json({ success: false, msg: 'Lỗi tặng quà: ' + e.message });
    }
});

// ============================================================
// PAGE ROUTES
// ============================================================
app.get('/', (req, res) => {
    if (req.session && req.session.user) {
        res.redirect('/chat');
    } else {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
    }
});

app.get('/login', (req, res) => {
    if (req.session && req.session.user) {
        res.redirect('/chat');
    } else {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
    }
});

app.get('/chat', (req, res) => {
    if (req.session && req.session.user) {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'chat.html'));
    } else {
        res.redirect('/login');
    }
});

app.get('/store', (req, res) => {
    if (req.session && req.session.user) {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'store.html'));
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// ============================================================
// SOCKET.IO
// ============================================================
const onlineUsers = {};
const userSockets = {};

io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);
    
    socket.on('user-online', (username) => {
        onlineUsers[socket.id] = username;
        userSockets[username] = socket.id;
        io.emit('online-users', Object.values(onlineUsers));
        console.log(`👤 ${username} is online (Socket: ${socket.id})`);
    });
    
    socket.on('chat-message', (data) => {
        const { chatId, message, from, effect, mentions, image, frame, avatarFrame, gradient, typing, highlight } = data;
        if (!chatId || (!message && !image)) return;
        
        console.log(`📩 Message from ${from} to ${chatId}: ${message || '[Image]'}`);
        
        if (chatId.startsWith('group_')) {
            const groupId = chatId;
            if (isUserMuted(groupId, from)) {
                socket.emit('muted-notification', { chatId, msg: 'Bạn đã bị mute trong nhóm này!' });
                return;
            }
            if (isUserBanned(groupId, from)) {
                socket.emit('banned-notification', { chatId, msg: 'Bạn đã bị ban khỏi nhóm này!' });
                return;
            }
        }
        
        const user = findUserByUsername(from);
        const userEffects = user?.effects || [];
        let finalEffect = 'none';
        if (effect && effect !== 'none' && userEffects.includes(effect)) {
            finalEffect = effect;
        }
        
        const msgData = {
            from: from || 'Unknown',
            text: message || '',
            image: image || '',
            time: new Date().toISOString(),
            effect: finalEffect,
            mentions: mentions || [],
            frame: frame || 'default',
            avatarFrame: avatarFrame || 'default',
            gradient: gradient || false,
            typing: typing || false,
            highlight: highlight || false
        };
        
        addMessage(chatId, msgData);
        
        io.to(chatId).emit('new-message', { ...msgData, chatId });
        console.log(`✅ Message broadcast to room: ${chatId}`);
        
        if (mentions && mentions.length > 0) {
            mentions.forEach(mentionedUser => {
                if (mentionedUser !== from) {
                    addNotification(mentionedUser, 'mention', {
                        from: from,
                        chatId: chatId,
                        message: `${from} đã đề cập đến bạn trong tin nhắn: "${message || '[Hình ảnh]'}"`
                    });
                }
            });
        }
        
        if (from) {
            try {
                const userData = findUserByUsername(from);
                if (userData) {
                    let missions = userData.seasonMissions || {};
                    const today = new Date().toISOString().split('T')[0];
                    const lastReset = userData.seasonLastReset || new Date().toISOString();
                    const lastResetDate = new Date(lastReset).toISOString().split('T')[0];
                    
                    if (today !== lastResetDate) {
                        MISSIONS_DEF.daily.forEach(m => {
                            missions[m.id] = { current: 0, claimed: false };
                        });
                    }
                    
                    let updated = false;
                    if (missions.daily_messages_10 !== undefined && !missions.daily_messages_10.claimed) {
                        missions.daily_messages_10.current = (missions.daily_messages_10.current || 0) + 1;
                        updated = true;
                    }
                    if (missions.daily_messages_30 !== undefined && !missions.daily_messages_30.claimed) {
                        missions.daily_messages_30.current = (missions.daily_messages_30.current || 0) + 1;
                        updated = true;
                    }
                    if (missions.weekly_messages_100 !== undefined && !missions.weekly_messages_100.claimed) {
                        missions.weekly_messages_100.current = (missions.weekly_messages_100.current || 0) + 1;
                        updated = true;
                    }
                    
                    if (updated) {
                        updateUser(from, { seasonMissions: missions });
                        const updatedUser = findUserByUsername(from);
                        const seasonData = getSeasonData(updatedUser);
                        io.emit('season-updated', {
                            username: from,
                            seasonData: seasonData,
                            timestamp: Date.now()
                        });
                    }
                }
            } catch (e) {}
        }
    });
    
    socket.on('join-room', (chatId) => {
        if (!chatId) return;
        socket.join(chatId);
        const messages = loadMessages(chatId);
        socket.emit('chat-history', { chatId, messages });
        console.log(`📌 ${socket.id} joined room: ${chatId}`);
    });
    
    socket.on('leave-room', (chatId) => {
        if (chatId) socket.leave(chatId);
        console.log(`🚪 ${socket.id} left room: ${chatId}`);
    });
    
    socket.on('group-action', (data) => {
        const { groupId, action, targetUser, byUser } = data;
        console.log(`📌 Group action: ${action} on ${targetUser} by ${byUser} in ${groupId}`);
        
        if (action === 'kick') {
            let members = getGroupMembers();
            members = members.filter(m => !(m.groupId === groupId && m.userId === targetUser));
            saveGroupMembers(members);
            removeMute(groupId, targetUser);
            removeBan(groupId, targetUser);
            
            io.to(groupId).emit('member-kicked', { groupId, targetUser, byUser, timestamp: Date.now() });
            io.to(groupId).emit('group-updated', { groupId, type: 'member_kicked', userId: targetUser, byUser, timestamp: Date.now() });
            
            addNotification(targetUser, 'group_kick', {
                from: byUser,
                groupId: groupId,
                message: `${byUser} đã kick bạn khỏi nhóm`
            });
            
            const targetSocketId = userSockets[targetUser];
            if (targetSocketId) {
                io.to(targetSocketId).emit('you-were-kicked', { groupId, byUser, timestamp: Date.now() });
                io.sockets.sockets.get(targetSocketId)?.leave(groupId);
            }
        } else if (action === 'mute') {
            const result = addMute(groupId, targetUser);
            if (result) {
                io.to(groupId).emit('member-muted', { groupId, targetUser, byUser, timestamp: Date.now() });
                io.to(groupId).emit('group-updated', { groupId, type: 'member_muted', userId: targetUser, byUser, timestamp: Date.now() });
                
                addNotification(targetUser, 'group_mute', {
                    from: byUser,
                    groupId: groupId,
                    message: `${byUser} đã mute bạn trong nhóm`
                });
                
                const targetSocketId = userSockets[targetUser];
                if (targetSocketId) {
                    io.to(targetSocketId).emit('you-were-muted', { groupId, byUser, timestamp: Date.now() });
                }
            }
        } else if (action === 'unmute') {
            const result = removeMute(groupId, targetUser);
            if (result) {
                io.to(groupId).emit('member-unmuted', { groupId, targetUser, byUser, timestamp: Date.now() });
                io.to(groupId).emit('group-updated', { groupId, type: 'member_unmuted', userId: targetUser, byUser, timestamp: Date.now() });
                
                addNotification(targetUser, 'group_unmute', {
                    from: byUser,
                    groupId: groupId,
                    message: `${byUser} đã bỏ mute bạn trong nhóm`
                });
                
                const targetSocketId = userSockets[targetUser];
                if (targetSocketId) {
                    io.to(targetSocketId).emit('you-were-unmuted', { groupId, byUser, timestamp: Date.now() });
                }
            }
        } else if (action === 'ban') {
            const result = addBan(groupId, targetUser);
            if (result) {
                let members = getGroupMembers();
                members = members.filter(m => !(m.groupId === groupId && m.userId === targetUser));
                saveGroupMembers(members);
                
                io.to(groupId).emit('member-banned', { groupId, targetUser, byUser, timestamp: Date.now() });
                io.to(groupId).emit('group-updated', { groupId, type: 'member_banned', userId: targetUser, byUser, timestamp: Date.now() });
                io.to(groupId).emit('member-kicked', { groupId, targetUser, byUser, timestamp: Date.now() });
                
                addNotification(targetUser, 'group_ban', {
                    from: byUser,
                    groupId: groupId,
                    message: `${byUser} đã ban bạn khỏi nhóm`
                });
                
                const targetSocketId = userSockets[targetUser];
                if (targetSocketId) {
                    io.to(targetSocketId).emit('you-were-banned', { groupId, byUser, timestamp: Date.now() });
                    io.sockets.sockets.get(targetSocketId)?.leave(groupId);
                }
            }
        } else if (action === 'unban') {
            const result = removeBan(groupId, targetUser);
            if (result) {
                io.to(groupId).emit('member-unbanned', { groupId, targetUser, byUser, timestamp: Date.now() });
                io.to(groupId).emit('group-updated', { groupId, type: 'member_unbanned', userId: targetUser, byUser, timestamp: Date.now() });
                
                addNotification(targetUser, 'group_unban', {
                    from: byUser,
                    groupId: groupId,
                    message: `${byUser} đã bỏ ban bạn khỏi nhóm`
                });
            }
        }
    });
    
    socket.on('disconnect', () => {
        const username = onlineUsers[socket.id];
        if (username) {
            delete onlineUsers[socket.id];
            delete userSockets[username];
            io.emit('online-users', Object.values(onlineUsers));
            console.log(`👋 ${username} disconnected`);
        }
    });
});

// ============================================================
// CATCH-ALL API ROUTE
// ============================================================
app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, msg: 'API endpoint not found' });
});

// ============================================================
// DEFAULT USERS
// ============================================================
function createDefaultUsers() {
    const users = getUsers();
    if (users.length === 0) {
        const defaultUsers = [
            {
                username: 'owner',
                email: 'nguyenvietnamtthsp@gmail.com',
                password: 'cihonenam123',
                role: 'owner',
                tier: 'legend',
                tierExpiry: null,
                displayName: '👑 Owner',
                effects: ['twinkle','shimmer','glow','bubble','explode','rainbow','fire','dragon','aurora','starlight','galaxy'],
                cash: 10000000,
                totalTopup: 10000000,
                badges: ['Người kết nối','Nhà sưu tập','Nhà phát tài','Đại gia','Huyền thoại'],
                themes: ['default','theme1','theme2','theme3','theme4','theme5','theme6','theme7'],
                refreshTokens: 999,
                currentTheme: 'default',
                currentBadge: 'Huyền thoại',
                frames: ['default','frame1','frame2','frame3','frame4','frame5','frame6','frame7'],
                gradientText: true,
                typingEffect: true,
                avatarFrames: ['default','avtframe1','avtframe2','avtframe3','avtframe4','avtframe5','avtframe6'],
                highlightedName: true,
                avatarUrl: null,
                msgColor: '#ff6b6b',
                seasonTier: 50,
                seasonExp: 0,
                seasonMaxExp: 100,
                seasonIsElite: true,
                seasonClaimedRewards: Array.from({length: 50}, (_, i) => i + 1),
                seasonClaimedElite: Array.from({length: 50}, (_, i) => i + 1),
                vipExpiry: new Date(Date.now() + 365*24*60*60*1000).toISOString(),
                vipActive: true,
                achievements: {}
            },
            {
                username: 'admin',
                email: 'admin@chat.com',
                password: 'staff1405',
                role: 'admin',
                tier: 'vip',
                tierExpiry: null,
                displayName: '🛡️ Admin',
                effects: ['twinkle','shimmer','glow'],
                cash: 500000,
                totalTopup: 500000,
                badges: ['Người kết nối'],
                themes: ['default','theme1','theme6','theme7'],
                refreshTokens: 100,
                currentTheme: 'default',
                currentBadge: null,
                frames: ['default','frame1','frame3'],
                gradientText: true,
                typingEffect: false,
                avatarFrames: ['default','avtframe1'],
                highlightedName: false,
                avatarUrl: null,
                msgColor: '#3498db',
                seasonTier: 20,
                seasonExp: 0,
                seasonMaxExp: 100,
                seasonIsElite: true,
                seasonClaimedRewards: Array.from({length: 20}, (_, i) => i + 1),
                seasonClaimedElite: Array.from({length: 20}, (_, i) => i + 1),
                vipExpiry: new Date(Date.now() + 90*24*60*60*1000).toISOString(),
                vipActive: true,
                achievements: {}
            },
            {
                username: 'manager',
                email: 'manager@chat.com',
                password: 'quanly1405',
                role: 'manager',
                tier: 'platinum',
                tierExpiry: null,
                displayName: '📊 Manager',
                effects: ['twinkle','glow'],
                cash: 300000,
                totalTopup: 300000,
                badges: ['Người kết nối'],
                themes: ['default','theme1','theme7'],
                refreshTokens: 50,
                currentTheme: 'default',
                currentBadge: null,
                frames: ['default','frame1'],
                gradientText: false,
                typingEffect: false,
                avatarFrames: ['default'],
                highlightedName: false,
                avatarUrl: null,
                msgColor: '#2ecc71',
                seasonTier: 10,
                seasonExp: 50,
                seasonMaxExp: 100,
                seasonIsElite: false,
                seasonClaimedRewards: Array.from({length: 10}, (_, i) => i + 1),
                seasonClaimedElite: [],
                vipExpiry: null,
                vipActive: false,
                achievements: {}
            },
            {
                username: 'support',
                email: 'support@chat.com',
                password: 'hotro1703',
                role: 'support',
                tier: 'gold',
                tierExpiry: null,
                displayName: '🎯 Support',
                effects: ['twinkle'],
                cash: 200000,
                totalTopup: 200000,
                badges: [],
                themes: ['default','theme7'],
                refreshTokens: 20,
                currentTheme: 'default',
                currentBadge: null,
                frames: ['default'],
                gradientText: false,
                typingEffect: false,
                avatarFrames: ['default'],
                highlightedName: false,
                avatarUrl: null,
                msgColor: '#f39c12',
                seasonTier: 5,
                seasonExp: 30,
                seasonMaxExp: 100,
                seasonIsElite: false,
                seasonClaimedRewards: Array.from({length: 5}, (_, i) => i + 1),
                seasonClaimedElite: [],
                vipExpiry: null,
                vipActive: false,
                achievements: {}
            },
            {
                username: 'test',
                email: 'test@test.com',
                password: '123456',
                role: 'user',
                tier: 'user',
                tierExpiry: null,
                displayName: '🧪 Test',
                effects: ['twinkle'],
                cash: 50000,
                totalTopup: 0,
                badges: [],
                themes: ['default','theme7'],
                refreshTokens: 1,
                currentTheme: 'default',
                currentBadge: null,
                frames: ['default'],
                gradientText: false,
                typingEffect: false,
                avatarFrames: ['default'],
                highlightedName: false,
                avatarUrl: null,
                msgColor: '#6C2BD9',
                seasonTier: 0,
                seasonExp: 0,
                seasonMaxExp: 100,
                seasonIsElite: false,
                seasonClaimedRewards: [],
                seasonClaimedElite: [],
                vipExpiry: null,
                vipActive: false,
                achievements: {}
            },
            {
                username: 'demo',
                email: 'demo@demo.com',
                password: '123456',
                role: 'user',
                tier: 'user',
                tierExpiry: null,
                displayName: '🎮 Demo',
                effects: [],
                cash: 20000,
                totalTopup: 0,
                badges: [],
                themes: ['default','theme7'],
                refreshTokens: 0,
                currentTheme: 'default',
                currentBadge: null,
                frames: ['default'],
                gradientText: false,
                typingEffect: false,
                avatarFrames: ['default'],
                highlightedName: false,
                avatarUrl: null,
                msgColor: '#6C2BD9',
                seasonTier: 0,
                seasonExp: 0,
                seasonMaxExp: 100,
                seasonIsElite: false,
                seasonClaimedRewards: [],
                seasonClaimedElite: [],
                vipExpiry: null,
                vipActive: false,
                achievements: {}
            },
            {
                username: 'user1',
                email: 'user1@test.com',
                password: '123456',
                role: 'user',
                tier: 'user',
                tierExpiry: null,
                displayName: '👤 User One',
                effects: ['twinkle','glow'],
                cash: 100000,
                totalTopup: 0,
                badges: ['Nhà sưu tập'],
                themes: ['default','theme7'],
                refreshTokens: 0,
                currentTheme: 'default',
                currentBadge: null,
                frames: ['default'],
                gradientText: false,
                typingEffect: false,
                avatarFrames: ['default'],
                highlightedName: false,
                avatarUrl: null,
                msgColor: '#2ecc71',
                seasonTier: 2,
                seasonExp: 45,
                seasonMaxExp: 100,
                seasonIsElite: false,
                seasonClaimedRewards: [1, 2],
                seasonClaimedElite: [],
                vipExpiry: null,
                vipActive: false,
                achievements: {}
            },
            {
                username: 'user2',
                email: 'user2@test.com',
                password: '123456',
                role: 'user',
                tier: 'platinum',
                tierExpiry: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
                displayName: '💎 User Platinum',
                effects: ['twinkle','glow','shimmer'],
                cash: 150000,
                totalTopup: 150000,
                badges: ['Bạch kim','Nhà sưu tập'],
                themes: ['default','theme1','theme6','theme7'],
                refreshTokens: 2,
                currentTheme: 'default',
                currentBadge: null,
                frames: ['default','frame1'],
                gradientText: false,
                typingEffect: false,
                avatarFrames: ['default'],
                highlightedName: false,
                avatarUrl: null,
                msgColor: '#f7971e',
                seasonTier: 8,
                seasonExp: 20,
                seasonMaxExp: 100,
                seasonIsElite: false,
                seasonClaimedRewards: Array.from({length: 8}, (_, i) => i + 1),
                seasonClaimedElite: [],
                vipExpiry: null,
                vipActive: false,
                achievements: {}
            }
        ];
        saveUsers(defaultUsers);
        console.log('✅ Users mặc định đã tạo');
        console.log('📝 Tài khoản mặc định:');
        console.log('  👑 Owner: owner / cihonenam123');
        console.log('  🛡️ Admin: admin / staff1405');
        console.log('  📊 Manager: manager / quanly1405');
        console.log('  🎯 Support: support / hotro1703');
        console.log('  🧪 Test: test / 123456');
        console.log('  🎮 Demo: demo / 123456');
        console.log('  👤 User1: user1 / 123456');
        console.log('  👤 User2: user2 / 123456');
    }
    initializeChatChung();
}

// ============================================================
// ERROR HANDLER
// ============================================================
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    if (err instanceof multer.MulterError) {
        if (err.code === 'FILE_TOO_LARGE') {
            return res.status(400).json({ success: false, msg: 'File ảnh quá lớn (tối đa 5MB).' });
        }
        return res.status(400).json({ success: false, msg: 'Lỗi upload: ' + err.message });
    }
    res.status(500).json({ success: false, msg: 'Đã xảy ra lỗi server.' });
});

// ============================================================
// START SERVER
// ============================================================
createDefaultUsers();

server.listen(PORT, () => {
    console.log(`\n🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`🔐 Login: http://localhost:${PORT}/login`);
    console.log(`💬 Chat: http://localhost:${PORT}/chat`);
    console.log(`🛒 Store: http://localhost:${PORT}/store`);
    console.log('\n📝 Tài khoản mặc định:');
    console.log('  👑 Owner: owner / cihonenam123');
    console.log('  🛡️ Admin: admin / staff1405');
    console.log('  📊 Manager: manager / quanly1405');
    console.log('  🎯 Support: support / hotro1703');
    console.log('  🧪 Test: test / 123456');
    console.log('  🎮 Demo: demo / 123456');
    console.log('  👤 User1: user1 / 123456');
    console.log('  👤 User2: user2 / 123456');
    console.log('\n🔥 Season Pass đã được kích hoạt!');
    console.log('👑 VIP System đã được kích hoạt!');
    console.log('🏆 Achievement System đã được kích hoạt!');
    console.log('⚡ Flash Sale System đã được kích hoạt!');
    console.log('🎂 Birthday System đã được kích hoạt!');
    console.log('🔄 Random Effects (3h) đã được kích hoạt!');
    console.log('\n📋 Hệ thống nhiệm vụ đã sẵn sàng!');
    console.log('🔄 Nhiệm vụ sẽ tự động cập nhật khi chat!');
});