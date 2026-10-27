// ============================================================
// TOAST
// ============================================================
function showToast(type, message) {
    const existing = document.querySelector('.toast');
    if (existing) {
        existing.classList.add('hide');
        setTimeout(() => existing.remove(), 300);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================================
// LANGUAGE SYSTEM
// ============================================================
const LANG = {
    vi: {
        code: 'vi', flag: '🇻🇳', label: 'VI', name: 'Tiếng Việt',
        'sidebar.friends': 'Bạn bè',
        'sidebar.groups': 'Nhóm',
        'sidebar.add_friend': 'Kết bạn',
        'sidebar.create_group': 'Tạo nhóm',
        'sidebar.store': 'Cửa hàng',
        'sidebar.theme': 'Theme',
        'sidebar.achievements': 'Thành tựu',
        'sidebar.admin': 'Quản lý',
        'sidebar.logout': 'Thoát',
        'sidebar.settings': 'Cài đặt',
        'sidebar.online': 'Online',
        'sidebar.notifications': 'Thông báo',
        'sidebar.pending': 'Đang chờ',
        'sidebar.no_friends': 'Chưa có bạn bè',
        'sidebar.no_groups': 'Chưa có nhóm',
        'sidebar.vip': 'VIP',
        'chat.title': 'Chat Pro',
        'chat.sub': 'Chọn bạn bè hoặc nhóm để trò chuyện',
        'chat.placeholder': 'Chọn một cuộc trò chuyện để bắt đầu',
        'chat.input_placeholder': 'Nhập tin nhắn... (gõ @ để tag người khác)',
        'chat.send': 'Gửi',
        'chat.emoji': 'Emoji',
        'chat.effect': 'Hiệu ứng',
        'chat.effect_off': 'Tắt',
        'chat.frame': 'Khung',
        'chat.gradient': 'Gradient',
        'chat.typing': 'Typing',
        'chat.highlight': 'Highlight',
        'chat.image': 'Ảnh',
        'chat.bg_color': 'Màu nền',
        'chat.msg_color': 'Màu tin',
        'chat.add_member': 'Thêm thành viên',
        'chat.view_members': 'Thành viên',
        'chat.clear_chat': 'Xóa tin nhắn',
        'chat.leave_group': 'Rời nhóm',
        'chat.private_chat': 'Trò chuyện riêng tư',
        'chat.group_chat': 'Nhóm chung',
        'chat.members': 'thành viên',
        'chat.avatar_edit': 'Đổi',
        'chat.muted': 'Đã bị mute',
        'chat.banned': 'Đã bị ban',
        'chat.muted_desc': 'Bạn không thể gửi tin nhắn trong nhóm này',
        'chat.banned_desc': 'Bạn đã bị ban khỏi nhóm này',
        'chat.no_messages': 'Chưa có tin nhắn',
        'settings.title': 'Cài đặt',
        'settings.sub': 'Tùy chỉnh ứng dụng',
        'settings.language': 'Ngôn ngữ',
        'settings.theme': 'Theme mặc định',
        'settings.close': 'Đóng',
        'settings.switch_to_en': 'Đổi sang EN',
        'settings.switch_to_vi': 'Đổi sang VI',
        'settings.default_theme': 'Mặc định',
        'friend.title': 'Kết bạn',
        'friend.sub': 'Nhập tên đăng nhập',
        'friend.placeholder': 'Tên đăng nhập',
        'friend.send': 'Gửi',
        'friend.cancel': 'Hủy',
        'friend.cannot_self': 'Không thể kết bạn với chính mình.',
        'group.title': 'Tạo nhóm',
        'group.sub': 'Tên nhóm',
        'group.placeholder': 'Tên nhóm',
        'group.create': 'Tạo',
        'group.add_member_title': 'Thêm thành viên vào nhóm',
        'group.add_member_sub': 'Chọn bạn bè để thêm',
        'group.already_in': 'Đã có',
        'group.add_btn': 'Thêm',
        'group.owner': 'Chủ nhóm',
        'group.member': 'Thành viên',
        'group.member_list_title': 'Thành viên nhóm',
        'group.member_list_sub': 'Danh sách thành viên trong nhóm',
        'group.kick': 'Kick',
        'group.mute': 'Mute',
        'group.unmute': 'Bỏ mute',
        'group.ban': 'Ban',
        'group.unban': 'Bỏ ban',
        'group.muted': 'Đã bị mute',
        'group.banned': 'Đã bị ban',
        'ach.title': 'Thành tựu',
        'ach.sub': 'Danh sách các thành tựu. Bạn có thể bật một thành tựu để hiển thị bên cạnh tên.',
        'ach.unlocked': 'Đã mở',
        'ach.locked': 'Chưa mở',
        'ach.use': 'Sử dụng',
        'ach.remove': 'Gỡ',
        'effect.title': 'Chọn hiệu ứng',
        'effect.none': 'Không hiệu ứng',
        'effect.using': 'Đang dùng',
        'effect.owned': 'Sở hữu',
        'effect.close': 'Đóng',
        'effect.turn_off': 'Tắt',
        'theme.title': 'Chọn Theme',
        'theme.sub': 'Chọn ảnh nền cho khung chat',
        'theme.default': 'Mặc định',
        'theme.theme1': 'Theme 1',
        'theme.theme2': 'Theme 2',
        'theme.theme3': 'Theme 3',
        'theme.theme4': 'Theme 4',
        'theme.theme5': 'Theme 5',
        'theme.theme6': 'Theme 6 (Bạch kim)',
        'theme.theme7': 'Theme 7 (Miễn phí)',
        'theme.close': 'Đóng',
        'frame.title': 'Chọn Frame',
        'frame.sub': 'Chọn frame cho tin nhắn',
        'frame.default': 'Mặc định',
        'frame.frame1': 'Khung Vàng',
        'frame.frame2': 'Khung Bạc',
        'frame.frame3': 'Khung Kim Cương',
        'frame.frame4': 'Khung Hoa',
        'frame.frame5': 'Khung Neon',
        'frame.frame6': 'Khung Vũ trụ',
        'frame.frame7': 'Khung Lửa',
        'frame.using': 'Đang dùng',
        'frame.owned': 'Sở hữu',
        'frame.locked': 'Chưa sở hữu',
        'frame.close': 'Đóng',
        'frame.use': 'Sử dụng',
        'frame.remove': 'Gỡ',
        'frame.using_text': 'Đang dùng',
        'avatarframe.title': 'Đổi khung avatar',
        'avatarframe.sub': 'Chọn khung cho avatar',
        'avatarframe.default': 'Mặc định',
        'avatarframe.avtframe1': 'Khung Vàng',
        'avatarframe.avtframe2': 'Khung Bạch kim',
        'avatarframe.avtframe3': 'Khung Kim cương',
        'avatarframe.avtframe4': 'Khung Cầu vồng',
        'avatarframe.avtframe5': 'Khung Vũ trụ',
        'avatarframe.avtframe6': 'Khung Lửa',
        'avatarframe.using': 'Đang dùng',
        'avatarframe.owned': 'Sở hữu',
        'avatarframe.locked': 'Chưa sở hữu',
        'avatarframe.use': 'Sử dụng',
        'avatarframe.remove': 'Gỡ',
        'avatarframe.using_text': 'Đang dùng',
        'admin.title': 'Quản lý người dùng',
        'admin.sub': 'Danh sách tất cả người dùng',
        'admin.search': 'Tìm kiếm người dùng...',
        'admin.detail_title': 'Thông tin user',
        'admin.detail_close': 'Đóng',
        'admin.gift_title': 'Tặng quà cho',
        'admin.gift_sub': 'Chọn loại quà và vật phẩm',
        'admin.gift_type': 'Loại quà',
        'admin.gift_item': 'Vật phẩm',
        'admin.gift_cash_amount': 'Số tiền (💵)',
        'admin.gift_cancel': 'Hủy',
        'admin.gift_send': 'Gửi quà',
        'admin.user_info': 'Thông tin user',
        'admin.username': 'Tên đăng nhập',
        'admin.email': 'Email',
        'admin.role': 'Chức vụ',
        'admin.tier': 'Rank',
        'admin.cash': 'Tiền',
        'admin.total_topup': 'Tổng nạp',
        'admin.refresh_tokens': 'Token Refresh',
        'admin.effects': 'Hiệu ứng',
        'admin.badges': 'Badges',
        'admin.password': 'Mật khẩu',
        'admin.password_change': 'Đổi mật khẩu',
        'admin.password_new': 'Mật khẩu mới (tối thiểu 6 ký tự)',
        'admin.password_change_btn': 'Đổi',
        'admin.role_change': 'Thay đổi chức vụ',
        'admin.role_update_btn': 'Cập nhật',
        'admin.gift_to': 'Tặng quà cho',
        'role.owner': '👑 Owner',
        'role.admin': '🛡️ Admin',
        'role.manager': '📊 Manager',
        'role.support': '🎯 Support',
        'role.legend': 'Huyền thoại',
        'role.vip': 'VIP',
        'role.diamond': 'Kim cương',
        'role.platinum': 'Bạch kim',
        'role.gold': 'Vàng',
        'role.silver': 'Bạc',
        'role.bronze': 'Đồng',
        'role.user': 'User',
        'rank.bronze': 'Đồng',
        'rank.silver': 'Bạc',
        'rank.gold': 'Vàng',
        'rank.platinum': 'Bạch kim',
        'rank.diamond': 'Kim cương',
        'rank.vip': 'VIP',
        'rank.legend': 'Huyền thoại',
        'effect.twinkle': 'Lấp lánh',
        'effect.shimmer': 'Sáng bóng',
        'effect.glow': 'Chói lóa',
        'effect.bubble': 'Bong bóng',
        'effect.explode': 'Nổ',
        'effect.rainbow': 'Cầu vồng',
        'effect.fire': 'Lửa',
        'effect.dragon': 'Rồng cuộn',
        'effect.aurora': 'Cực quang',
        'effect.starlight': 'Ánh sao',
        'effect.galaxy': 'Thiên hà',
        'frame.default': 'Mặc định',
        'frame.frame1': 'Khung Vàng',
        'frame.frame2': 'Khung Bạc',
        'frame.frame3': 'Khung Kim Cương',
        'frame.frame4': 'Khung Hoa',
        'frame.frame5': 'Khung Neon',
        'frame.frame6': 'Khung Vũ trụ',
        'frame.frame7': 'Khung Lửa',
        'avatarframe.default': 'Mặc định',
        'avatarframe.avtframe1': 'Khung Vàng',
        'avatarframe.avtframe2': 'Khung Bạch kim',
        'avatarframe.avtframe3': 'Khung Kim cương',
        'avatarframe.avtframe4': 'Khung Cầu vồng',
        'avatarframe.avtframe5': 'Khung Vũ trụ',
        'avatarframe.avtframe6': 'Khung Lửa',
        'ach.connector': 'Người kết nối',
        'ach.collector': 'Nhà sưu tập',
        'ach.rich': 'Nhà giàu',
        'ach.millionaire': 'Đại gia',
        'ach.topup_starter': 'Nạp thử',
        'ach.topup_pro': 'Nạp nhiều',
        'ach.bronze': 'Đồng',
        'ach.silver': 'Bạc',
        'ach.gold': 'Vàng',
        'ach.platinum': 'Bạch kim',
        'ach.diamond': 'Kim cương',
        'ach.vip': 'VIP',
        'ach.legend': 'Huyền thoại',
        'toast.theme_changed': 'Đã đổi theme!',
        'toast.lang_changed_vi': 'Đã đổi ngôn ngữ sang Tiếng Việt!',
        'toast.lang_changed_en': 'Đã đổi ngôn ngữ sang Tiếng Anh!',
        'toast.need_message': 'Vui lòng nhập tin nhắn hoặc chọn ảnh',
        'toast.select_chat': 'Vui lòng chọn một cuộc trò chuyện.',
        'toast.no_connection': 'Mất kết nối server!',
        'toast.image_upload_success': 'Đã chọn ảnh, nhấn Enter để gửi...',
        'toast.image_upload_error': 'Lỗi upload ảnh',
        'toast.avatar_updated': 'Đã cập nhật avatar!',
        'toast.avatar_error': 'Lỗi upload avatar',
        'toast.badge_used': 'Đã sử dụng badge: ',
        'toast.badge_removed': 'Đã gỡ badge.',
        'toast.msg_color_changed': 'Đã đổi màu tin nhắn!',
        'toast.no_frame': 'Bạn chưa sở hữu frame nào. Mua frame tại Store!',
        'toast.frame_selected': 'Đã chọn frame: {name}',
        'toast.frame_removed': 'Đã gỡ frame.',
        'toast.no_gradient': 'Bạn chưa sở hữu Gradient Text. Mua tại Store!',
        'toast.no_typing': 'Bạn chưa sở hữu Typing Effect. Mua tại Store!',
        'toast.no_highlight': 'Bạn chưa sở hữu Highlighted Name. Mua tại Store!',
        'toast.friend_request_sent': 'Đã gửi lời mời kết bạn đến {name}!',
        'toast.friend_request_error': 'Lỗi gửi lời mời',
        'toast.group_created': 'Tạo nhóm thành công!',
        'toast.group_error': 'Lỗi tạo nhóm',
        'toast.member_added': 'Đã thêm {name} vào nhóm!',
        'toast.member_error': 'Lỗi thêm thành viên',
        'toast.left_group': 'Đã rời nhóm.',
        'toast.leave_error': 'Lỗi rời nhóm',
        'toast.chat_cleared': 'Đã xóa tin nhắn.',
        'toast.clear_error': 'Lỗi xóa tin nhắn',
        'toast.cannot_clear_chat_chung': 'Không thể xóa tin nhắn trong Chat Chung.',
        'toast.cannot_leave_chat_chung': 'Không thể rời Chat Chung.',
        'toast.account_updated': 'Tài khoản đã được cập nhật!',
        'toast.loading_error': 'Lỗi tải dữ liệu: ',
        'toast.you_were_kicked': 'Bạn đã bị kick khỏi nhóm!',
        'toast.you_were_muted': 'Bạn đã bị mute trong nhóm này!',
        'toast.you_were_unmuted': 'Bạn đã được bỏ mute trong nhóm này!',
        'toast.you_were_banned': 'Bạn đã bị ban khỏi nhóm!',
        'toast.you_were_unbanned': 'Bạn đã được bỏ ban khỏi nhóm!',
        'toast.avatarframe_selected': 'Đã chọn khung avatar: {name}',
        'toast.avatarframe_removed': 'Đã gỡ khung avatar.',
        'toast.char_limit_exceeded': 'Vượt quá giới hạn {limit} ký tự! ({length}/{limit})',
        'toast.rank_required': 'Yêu cầu rank {rank} để sử dụng tính năng này.',
        'toast.mission_updated': 'Nhiệm vụ đã được cập nhật!',
        'toast.cash_received': '💰 Đã nhận {amount} 💵 từ Admin!',
        'toast.season_claimed': 'Đã nhận thưởng!',
        'toast.season_upgraded': 'Nâng cấp Elite Pass thành công!',
        'toast.season_already_elite': 'Bạn đã có Elite Pass!',
        'toast.mission_claimed': 'Đã nhận thưởng nhiệm vụ! +{exp} EXP',
        'toast.mission_already_claimed': 'Nhiệm vụ đã được nhận thưởng.',
        'toast.friend_request_received': '{name} đã gửi lời mời kết bạn!',
        'toast.friend_accepted': '{name} đã chấp nhận lời mời kết bạn!',
        'toast.gift_received': '{name} đã tặng bạn {item}!',
        'toast.mention': '{name} đã đề cập đến bạn trong tin nhắn!',
        'toast.new_message': 'Tin nhắn mới từ {name}!',
        'toast.effect_expired': 'Hiệu ứng {effect} đã hết hạn!',
        'toast.vip_activated': '👑 Đã kích hoạt VIP thành công!',
        'toast.vip_claimed': '💰 Đã nhận 2,000 💵 VIP!',
        'toast.vip_already_claimed': 'Bạn đã nhận thưởng VIP hôm nay!',
        'toast.vip_not_active': 'Bạn chưa có VIP!',
        'toast.achievement_unlocked': '🏆 Đã mở khóa thành tựu: {name}!'
    },
    en: {
        code: 'en', flag: '🇬🇧', label: 'EN', name: 'English',
        'sidebar.friends': 'Friends',
        'sidebar.groups': 'Groups',
        'sidebar.add_friend': 'Add Friend',
        'sidebar.create_group': 'Create Group',
        'sidebar.store': 'Store',
        'sidebar.theme': 'Theme',
        'sidebar.achievements': 'Achievements',
        'sidebar.admin': 'Admin',
        'sidebar.logout': 'Logout',
        'sidebar.settings': 'Settings',
        'sidebar.online': 'Online',
        'sidebar.notifications': 'Notifications',
        'sidebar.pending': 'Pending',
        'sidebar.no_friends': 'No friends yet',
        'sidebar.no_groups': 'No groups yet',
        'sidebar.vip': 'VIP',
        'chat.title': 'Chat Pro',
        'chat.sub': 'Select a friend or group to chat',
        'chat.placeholder': 'Select a conversation to start',
        'chat.input_placeholder': 'Type a message... (type @ to tag someone)',
        'chat.send': 'Send',
        'chat.emoji': 'Emoji',
        'chat.effect': 'Effect',
        'chat.effect_off': 'Off',
        'chat.frame': 'Frame',
        'chat.gradient': 'Gradient',
        'chat.typing': 'Typing',
        'chat.highlight': 'Highlight',
        'chat.image': 'Image',
        'chat.bg_color': 'BG Color',
        'chat.msg_color': 'Msg Color',
        'chat.add_member': 'Add Member',
        'chat.view_members': 'Members',
        'chat.clear_chat': 'Clear Chat',
        'chat.leave_group': 'Leave Group',
        'chat.private_chat': 'Private chat',
        'chat.group_chat': 'Group chat',
        'chat.members': 'members',
        'chat.avatar_edit': 'Change',
        'chat.muted': 'Muted',
        'chat.banned': 'Banned',
        'chat.muted_desc': 'You cannot send messages in this group',
        'chat.banned_desc': 'You have been banned from this group',
        'chat.no_messages': 'No messages yet',
        'settings.title': 'Settings',
        'settings.sub': 'Customize your app',
        'settings.language': 'Language',
        'settings.theme': 'Default Theme',
        'settings.close': 'Close',
        'settings.switch_to_en': 'Switch to EN',
        'settings.switch_to_vi': 'Switch to VI',
        'settings.default_theme': 'Default',
        'friend.title': 'Add Friend',
        'friend.sub': 'Enter username',
        'friend.placeholder': 'Username',
        'friend.send': 'Send',
        'friend.cancel': 'Cancel',
        'friend.cannot_self': 'Cannot add yourself as friend.',
        'group.title': 'Create Group',
        'group.sub': 'Group Name',
        'group.placeholder': 'Group Name',
        'group.create': 'Create',
        'group.add_member_title': 'Add member to group',
        'group.add_member_sub': 'Select friends to add',
        'group.already_in': 'Already in',
        'group.add_btn': 'Add',
        'group.owner': 'Owner',
        'group.member': 'Member',
        'group.member_list_title': 'Group Members',
        'group.member_list_sub': 'List of members in this group',
        'group.kick': 'Kick',
        'group.mute': 'Mute',
        'group.unmute': 'Unmute',
        'group.ban': 'Ban',
        'group.unban': 'Unban',
        'group.muted': 'Muted',
        'group.banned': 'Banned',
        'ach.title': 'Achievements',
        'ach.sub': 'List of achievements. You can activate one to display next to your name.',
        'ach.unlocked': 'Unlocked',
        'ach.locked': 'Locked',
        'ach.use': 'Use',
        'ach.remove': 'Remove',
        'effect.title': 'Select Effect',
        'effect.none': 'No Effect',
        'effect.using': 'Using',
        'effect.owned': 'Owned',
        'effect.close': 'Close',
        'effect.turn_off': 'Turn Off',
        'theme.title': 'Select Theme',
        'theme.sub': 'Choose background image for chat',
        'theme.default': 'Default',
        'theme.theme1': 'Theme 1',
        'theme.theme2': 'Theme 2',
        'theme.theme3': 'Theme 3',
        'theme.theme4': 'Theme 4',
        'theme.theme5': 'Theme 5',
        'theme.theme6': 'Theme 6 (Platinum)',
        'theme.theme7': 'Theme 7 (Free)',
        'theme.close': 'Close',
        'frame.title': 'Select Frame',
        'frame.sub': 'Choose a frame for your messages',
        'frame.default': 'Default',
        'frame.frame1': 'Gold Frame',
        'frame.frame2': 'Silver Frame',
        'frame.frame3': 'Diamond Frame',
        'frame.frame4': 'Flower Frame',
        'frame.frame5': 'Neon Frame',
        'frame.frame6': 'Cosmic Frame',
        'frame.frame7': 'Inferno Frame',
        'frame.using': 'Using',
        'frame.owned': 'Owned',
        'frame.locked': 'Locked',
        'frame.close': 'Close',
        'frame.use': 'Use',
        'frame.remove': 'Remove',
        'frame.using_text': 'Using',
        'avatarframe.title': 'Change Avatar Frame',
        'avatarframe.sub': 'Choose a frame for your avatar',
        'avatarframe.default': 'Default',
        'avatarframe.avtframe1': 'Gold Frame',
        'avatarframe.avtframe2': 'Platinum Frame',
        'avatarframe.avtframe3': 'Diamond Frame',
        'avatarframe.avtframe4': 'Rainbow Frame',
        'avatarframe.avtframe5': 'Cosmic Frame',
        'avatarframe.avtframe6': 'Inferno Frame',
        'avatarframe.using': 'Using',
        'avatarframe.owned': 'Owned',
        'avatarframe.locked': 'Locked',
        'avatarframe.use': 'Use',
        'avatarframe.remove': 'Remove',
        'avatarframe.using_text': 'Using',
        'admin.title': 'User Management',
        'admin.sub': 'List of all users',
        'admin.search': 'Search users...',
        'admin.detail_title': 'User Info',
        'admin.detail_close': 'Close',
        'admin.gift_title': 'Gift to',
        'admin.gift_sub': 'Select gift type and item',
        'admin.gift_type': 'Gift Type',
        'admin.gift_item': 'Item',
        'admin.gift_cash_amount': 'Amount (💵)',
        'admin.gift_cancel': 'Cancel',
        'admin.gift_send': 'Send Gift',
        'admin.user_info': 'User Info',
        'admin.username': 'Username',
        'admin.email': 'Email',
        'admin.role': 'Role',
        'admin.tier': 'Rank',
        'admin.cash': 'Cash',
        'admin.total_topup': 'Total Topup',
        'admin.refresh_tokens': 'Refresh Tokens',
        'admin.effects': 'Effects',
        'admin.badges': 'Badges',
        'admin.password': 'Password',
        'admin.password_change': 'Change Password',
        'admin.password_new': 'New password (min 6 characters)',
        'admin.password_change_btn': 'Change',
        'admin.role_change': 'Change Role',
        'admin.role_update_btn': 'Update',
        'admin.gift_to': 'Gift to',
        'role.owner': '👑 Owner',
        'role.admin': '🛡️ Admin',
        'role.manager': '📊 Manager',
        'role.support': '🎯 Support',
        'role.legend': 'Legend',
        'role.vip': 'VIP',
        'role.diamond': 'Diamond',
        'role.platinum': 'Platinum',
        'role.gold': 'Gold',
        'role.silver': 'Silver',
        'role.bronze': 'Bronze',
        'role.user': 'User',
        'rank.bronze': 'Bronze',
        'rank.silver': 'Silver',
        'rank.gold': 'Gold',
        'rank.platinum': 'Platinum',
        'rank.diamond': 'Diamond',
        'rank.vip': 'VIP',
        'rank.legend': 'Legend',
        'effect.twinkle': 'Twinkle',
        'effect.shimmer': 'Shimmer',
        'effect.glow': 'Glow',
        'effect.bubble': 'Bubble',
        'effect.explode': 'Explode',
        'effect.rainbow': 'Rainbow',
        'effect.fire': 'Fire',
        'effect.dragon': 'Dragon',
        'effect.aurora': 'Aurora',
        'effect.starlight': 'Starlight',
        'effect.galaxy': 'Galaxy',
        'frame.default': 'Default',
        'frame.frame1': 'Gold Frame',
        'frame.frame2': 'Silver Frame',
        'frame.frame3': 'Diamond Frame',
        'frame.frame4': 'Flower Frame',
        'frame.frame5': 'Neon Frame',
        'frame.frame6': 'Cosmic Frame',
        'frame.frame7': 'Inferno Frame',
        'avatarframe.default': 'Default',
        'avatarframe.avtframe1': 'Gold Frame',
        'avatarframe.avtframe2': 'Platinum Frame',
        'avatarframe.avtframe3': 'Diamond Frame',
        'avatarframe.avtframe4': 'Rainbow Frame',
        'avatarframe.avtframe5': 'Cosmic Frame',
        'avatarframe.avtframe6': 'Inferno Frame',
        'ach.connector': 'Connector',
        'ach.collector': 'Collector',
        'ach.rich': 'Rich',
        'ach.millionaire': 'Millionaire',
        'ach.topup_starter': 'Topup Starter',
        'ach.topup_pro': 'Topup Pro',
        'ach.bronze': 'Bronze',
        'ach.silver': 'Silver',
        'ach.gold': 'Gold',
        'ach.platinum': 'Platinum',
        'ach.diamond': 'Diamond',
        'ach.vip': 'VIP',
        'ach.legend': 'Legend',
        'toast.theme_changed': 'Theme changed!',
        'toast.lang_changed_vi': 'Switched to Vietnamese!',
        'toast.lang_changed_en': 'Switched to English!',
        'toast.need_message': 'Please enter a message or select an image',
        'toast.select_chat': 'Please select a conversation.',
        'toast.no_connection': 'Lost connection to server!',
        'toast.image_upload_success': 'Image selected, press Enter to send...',
        'toast.image_upload_error': 'Image upload error',
        'toast.avatar_updated': 'Avatar updated!',
        'toast.avatar_error': 'Avatar upload error',
        'toast.badge_used': 'Badge used: ',
        'toast.badge_removed': 'Badge removed.',
        'toast.msg_color_changed': 'Message color changed!',
        'toast.no_frame': 'You don\'t own any frame. Buy frames at Store!',
        'toast.frame_selected': 'Selected frame: {name}',
        'toast.frame_removed': 'Frame removed.',
        'toast.no_gradient': 'You don\'t own Gradient Text. Buy at Store!',
        'toast.no_typing': 'You don\'t own Typing Effect. Buy at Store!',
        'toast.no_highlight': 'You don\'t own Highlighted Name. Buy at Store!',
        'toast.friend_request_sent': 'Friend request sent to {name}!',
        'toast.friend_request_error': 'Error sending friend request',
        'toast.group_created': 'Group created successfully!',
        'toast.group_error': 'Error creating group',
        'toast.member_added': 'Added {name} to group!',
        'toast.member_error': 'Error adding member',
        'toast.left_group': 'Left group.',
        'toast.leave_error': 'Error leaving group',
        'toast.chat_cleared': 'Chat cleared.',
        'toast.clear_error': 'Error clearing chat',
        'toast.cannot_clear_chat_chung': 'Cannot clear messages in Chat Chung.',
        'toast.cannot_leave_chat_chung': 'Cannot leave Chat Chung.',
        'toast.account_updated': 'Account updated!',
        'toast.loading_error': 'Error loading data: ',
        'toast.you_were_kicked': 'You were kicked from the group!',
        'toast.you_were_muted': 'You were muted in this group!',
        'toast.you_were_unmuted': 'You were unmuted in this group!',
        'toast.you_were_banned': 'You were banned from the group!',
        'toast.you_were_unbanned': 'You were unbanned from the group!',
        'toast.avatarframe_selected': 'Selected avatar frame: {name}',
        'toast.avatarframe_removed': 'Avatar frame removed.',
        'toast.char_limit_exceeded': 'Exceeded {limit} character limit! ({length}/{limit})',
        'toast.rank_required': 'Rank {rank} required to use this feature.',
        'toast.mission_updated': 'Mission updated!',
        'toast.cash_received': '💰 Received {amount} 💵 from Admin!',
        'toast.season_claimed': 'Reward claimed!',
        'toast.season_upgraded': 'Elite Pass upgraded successfully!',
        'toast.season_already_elite': 'You already have Elite Pass!',
        'toast.mission_claimed': 'Mission reward claimed! +{exp} EXP',
        'toast.mission_already_claimed': 'Mission already claimed.',
        'toast.friend_request_received': '{name} sent you a friend request!',
        'toast.friend_accepted': '{name} accepted your friend request!',
        'toast.gift_received': '{name} gifted you {item}!',
        'toast.mention': '{name} mentioned you in a message!',
        'toast.new_message': 'New message from {name}!',
        'toast.effect_expired': 'Effect {effect} has expired!',
        'toast.vip_activated': '👑 VIP activated successfully!',
        'toast.vip_claimed': '💰 Claimed 2,000 💵 VIP!',
        'toast.vip_already_claimed': 'You already claimed VIP reward today!',
        'toast.vip_not_active': 'You are not VIP!',
        'toast.achievement_unlocked': '🏆 Unlocked achievement: {name}!'
    }
};

let currentLang = 'vi';
let langData = LANG.vi;

function t(key, replacements = {}) {
    let text = langData[key] || key;
    for (const [k, v] of Object.entries(replacements)) {
        text = text.replace(`{${k}}`, v);
    }
    return text;
}

function setLanguage(lang) {
    if (lang === 'en') {
        currentLang = 'en';
        langData = LANG.en;
        document.documentElement.lang = 'en';
    } else {
        currentLang = 'vi';
        langData = LANG.vi;
        document.documentElement.lang = 'vi';
    }
    localStorage.setItem('chat_lang', currentLang);
    updateLanguageUI();
    const langFlag = document.getElementById('langFlag');
    const langLabel = document.getElementById('langLabel');
    if (langFlag) langFlag.textContent = langData.flag;
    if (langLabel) langLabel.textContent = langData.label;
    sessionStorage.setItem('chat_lang', currentLang);
}

function loadLanguage() {
    const savedLang = localStorage.getItem('chat_lang') || sessionStorage.getItem('chat_lang') || 'vi';
    setLanguage(savedLang);
}

function updateLanguageUI() {
    const safeText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };
    
    safeText('tabFriends .tab-label', t('sidebar.friends'));
    safeText('tabGroups .tab-label', t('sidebar.groups'));
    safeText('addFriendBtn span', t('sidebar.add_friend'));
    safeText('createGroupBtn span', t('sidebar.create_group'));
    safeText('storeBtn span', t('sidebar.store'));
    safeText('themeBtn span', t('sidebar.theme'));
    safeText('achievementBtn span', t('sidebar.achievements'));
    safeText('adminManageBtn span', t('sidebar.admin'));
    safeText('settingsBtn span', t('sidebar.settings'));
    safeText('logoutBtn span', t('sidebar.logout'));
    safeText('vipBtn span', t('sidebar.vip'));
    
    const statusText = document.querySelector('.status .status-text');
    if (statusText) statusText.textContent = t('sidebar.online');
    
    const avatarEditText = document.querySelector('.avatar-edit .avatar-edit-text');
    if (avatarEditText) avatarEditText.textContent = t('chat.avatar_edit');
    
    const emojiLabel = document.querySelector('.emoji-label');
    if (emojiLabel) emojiLabel.textContent = t('chat.emoji');
    const effectLabel = document.querySelector('.effect-label');
    if (effectLabel) effectLabel.textContent = t('chat.effect');
    const frameLabel = document.querySelector('.frame-label');
    if (frameLabel) frameLabel.textContent = t('chat.frame');
    const gradientLabel = document.querySelector('.gradient-label');
    if (gradientLabel) gradientLabel.textContent = t('chat.gradient');
    const typingLabel = document.querySelector('.typing-label');
    if (typingLabel) typingLabel.textContent = t('chat.typing');
    const highlightLabel = document.querySelector('.highlight-label');
    if (highlightLabel) highlightLabel.textContent = t('chat.highlight');
    const imageLabel = document.querySelector('.image-label');
    if (imageLabel) imageLabel.textContent = t('chat.image');
    const bgLabel = document.querySelector('.bg-label');
    if (bgLabel) bgLabel.textContent = t('chat.bg_color');
    const msgLabel = document.querySelector('.msg-label');
    if (msgLabel) msgLabel.textContent = t('chat.msg_color');
    const sendLabel = document.querySelector('.send-label');
    if (sendLabel) sendLabel.textContent = t('chat.send');
    const msgInput = document.getElementById('msgInput');
    if (msgInput) msgInput.placeholder = t('chat.input_placeholder');
    
    const chatTitle = document.getElementById('chatTitle');
    if (chatTitle) chatTitle.textContent = t('chat.title');
    const chatSub = document.getElementById('chatSub');
    if (chatSub && currentChat) {
        if (currentChat.type === 'friend') {
            chatSub.textContent = '💬 ' + t('chat.private_chat');
        } else {
            chatSub.textContent = '👥 ' + t('chat.group_chat');
        }
    } else if (chatSub) {
        chatSub.textContent = t('chat.sub');
    }
    const placeholderText = document.querySelector('.placeholder-text');
    if (placeholderText) placeholderText.textContent = t('chat.placeholder');
    
    const mutedTitle = document.getElementById('mutedOverlayTitle');
    if (mutedTitle) mutedTitle.textContent = t('chat.muted');
    const mutedDesc = document.getElementById('mutedOverlayDesc');
    if (mutedDesc) mutedDesc.textContent = t('chat.muted_desc');
    
    safeText('settings-title', t('settings.title'));
    safeText('settings-sub', t('settings.sub'));
    safeText('lang-setting-label', t('settings.language'));
    safeText('theme-setting-label', t('settings.theme'));
    
    safeText('notif-modal-title', 'Thông báo');
    safeText('notif-modal-sub', 'Your recent notifications');
    safeText('markAllReadBtn', 'Đánh dấu đã đọc');
    
    renderSidebar();
    updateCharLimitUI();
}

// ============================================================
// CONSTANTS
// ============================================================
const ALL_EFFECTS = {
    'twinkle': { label: 'effect.twinkle', icon: '✨', vip: false },
    'shimmer': { label: 'effect.shimmer', icon: '💫', vip: false },
    'glow': { label: 'effect.glow', icon: '🌟', vip: false },
    'bubble': { label: 'effect.bubble', icon: '🫧', vip: false },
    'explode': { label: 'effect.explode', icon: '💥', vip: false },
    'rainbow': { label: 'effect.rainbow', icon: '🌈', vip: false },
    'fire': { label: 'effect.fire', icon: '🔥', vip: false },
    'dragon': { label: 'effect.dragon', icon: '🐉', vip: false },
    'aurora': { label: 'effect.aurora', icon: '🌌', vip: true },
    'starlight': { label: 'effect.starlight', icon: '⭐', vip: true },
    'galaxy': { label: 'effect.galaxy', icon: '🌠', vip: true }
};

const ALL_FRAMES = [
    { key: 'default', label: 'frame.default', icon: '🖼️', vip: false },
    { key: 'frame1', label: 'frame.frame1', icon: '🖼️', vip: false },
    { key: 'frame2', label: 'frame.frame2', icon: '🖼️', vip: false },
    { key: 'frame3', label: 'frame.frame3', icon: '🖼️', vip: false },
    { key: 'frame4', label: 'frame.frame4', icon: '🖼️', vip: false },
    { key: 'frame5', label: 'frame.frame5', icon: '🖼️', vip: false },
    { key: 'frame6', label: 'frame.frame6', icon: '🖼️', vip: true },
    { key: 'frame7', label: 'frame.frame7', icon: '🖼️', vip: true }
];

const ALL_AVATAR_FRAMES = [
    { key: 'default', label: 'avatarframe.default', icon: '👤', className: 'default-frame', vip: false },
    { key: 'avtframe1', label: 'avatarframe.avtframe1', icon: '👑', className: 'gold-frame', vip: false },
    { key: 'avtframe2', label: 'avatarframe.avtframe2', icon: '💎', className: 'platinum-frame', vip: false },
    { key: 'avtframe3', label: 'avatarframe.avtframe3', icon: '💠', className: 'diamond-frame', vip: false },
    { key: 'avtframe4', label: 'avatarframe.avtframe4', icon: '🌈', className: 'rainbow-frame', vip: true },
    { key: 'avtframe5', label: 'avatarframe.avtframe5', icon: '🌌', className: 'cosmic-frame', vip: true },
    { key: 'avtframe6', label: 'avatarframe.avtframe6', icon: '🔥', className: 'inferno-frame', vip: true }
];

const ALL_THEMES = [
    { key: 'default', label: 'theme.default', icon: '🌑', file: '' },
    { key: 'theme1', label: 'theme.theme1', icon: '🎨', file: 'theme1.png' },
    { key: 'theme2', label: 'theme.theme2', icon: '🎨', file: 'theme2.png' },
    { key: 'theme3', label: 'theme.theme3', icon: '🎨', file: 'theme3.png' },
    { key: 'theme4', label: 'theme.theme4', icon: '🎨', file: 'theme4.png' },
    { key: 'theme5', label: 'theme.theme5', icon: '🎨', file: 'theme5.png' },
    { key: 'theme6', label: 'theme.theme6', icon: '💎', file: 'theme6.png' },
    { key: 'theme7', label: 'theme.theme7', icon: '🌄', file: 'theme7.png' }
];

const ALL_AVATAR_FRAMES_MAP = {
    'default': { className: 'default-frame', label: 'avatarframe.default' },
    'avtframe1': { className: 'gold-frame', label: 'avatarframe.avtframe1' },
    'avtframe2': { className: 'platinum-frame', label: 'avatarframe.avtframe2' },
    'avtframe3': { className: 'diamond-frame', label: 'avatarframe.avtframe3' },
    'avtframe4': { className: 'rainbow-frame', label: 'avatarframe.avtframe4' },
    'avtframe5': { className: 'cosmic-frame', label: 'avatarframe.avtframe5' },
    'avtframe6': { className: 'inferno-frame', label: 'avatarframe.avtframe6' }
};

const EMOJIS = ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','🥰','😘','😗','😙','😚','☺️','🙂','🤗','🤩','🤔','🤨','😐','😑','😶','🙄','😏','😣','😥','😮','🤐','😯','😪','😫','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑','😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬','😰','😱','🥵','🥶','😳','🤪','😵','😡','😠','🤬'];

// ============================================================
// ACHIEVEMENTS - DANH SÁCH MỚI (26 THÀNH TỰU)
// ============================================================
const ACHIEVEMENTS_LIST = [
    { id: 'first_purchase', name: 'Người mua đầu tiên', desc: 'Mua item đầu tiên', icon: '🛒' },
    { id: 'collector_5', name: 'Nhà sưu tập cấp 1', desc: 'Sở hữu 5 item', icon: '📦' },
    { id: 'collector_10', name: 'Nhà sưu tập cấp 2', desc: 'Sở hữu 10 item', icon: '📦' },
    { id: 'collector_20', name: 'Nhà sưu tập cấp 3', desc: 'Sở hữu 20 item', icon: '📦' },
    { id: 'rich_100k', name: 'Nhà giàu', desc: 'Có 100,000 💵', icon: '💰' },
    { id: 'rich_500k', name: 'Đại gia', desc: 'Có 500,000 💵', icon: '💰' },
    { id: 'rich_1m', name: 'Tỷ phú', desc: 'Có 1,000,000 💵', icon: '💰' },
    { id: 'rank_bronze', name: 'Rank Đồng', desc: 'Đạt rank Đồng', icon: '🥉' },
    { id: 'rank_silver', name: 'Rank Bạc', desc: 'Đạt rank Bạc', icon: '🥈' },
    { id: 'rank_gold', name: 'Rank Vàng', desc: 'Đạt rank Vàng', icon: '🥇' },
    { id: 'rank_platinum', name: 'Rank Bạch kim', desc: 'Đạt rank Bạch kim', icon: '💎' },
    { id: 'rank_diamond', name: 'Rank Kim cương', desc: 'Đạt rank Kim cương', icon: '💠' },
    { id: 'rank_vip', name: 'Rank VIP', desc: 'Đạt rank VIP', icon: '👑' },
    { id: 'rank_legend', name: 'Rank Huyền thoại', desc: 'Đạt rank Huyền thoại', icon: '🌟' },
    { id: 'effects_3', name: 'Nhà ảo thuật', desc: 'Sở hữu 3 hiệu ứng', icon: '✨' },
    { id: 'effects_5', name: 'Phù thủy', desc: 'Sở hữu 5 hiệu ứng', icon: '🧙' },
    { id: 'frames_3', name: 'Người trang trí', desc: 'Sở hữu 3 frame', icon: '🖼️' },
    { id: 'frames_5', name: 'Nhà thiết kế', desc: 'Sở hữu 5 frame', icon: '🎨' },
    { id: 'avatar_frames_3', name: 'Người sành điệu', desc: 'Sở hữu 3 khung avatar', icon: '👤' },
    { id: 'season_10', name: 'Chiến binh mùa', desc: 'Đạt cấp 10 Season Pass', icon: '⚔️' },
    { id: 'season_25', name: 'Thợ săn', desc: 'Đạt cấp 25 Season Pass', icon: '🏹' },
    { id: 'season_50', name: 'Huyền thoại mùa', desc: 'Đạt cấp 50 Season Pass', icon: '👑' },
    { id: 'vip_subscriber', name: 'VIP', desc: 'Đăng ký VIP', icon: '👑' },
    { id: 'birthday_claimed', name: '🎂 Sinh nhật', desc: 'Nhận quà sinh nhật', icon: '🎂' },
    { id: 'friend_3', name: 'Người kết nối', desc: 'Có 3 bạn bè', icon: '🤝' },
    { id: 'friend_10', name: 'Người nổi tiếng', desc: 'Có 10 bạn bè', icon: '🌟' }
];

// ============================================================
// SEASON PASS CONSTANTS
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
// STATE
// ============================================================
let currentUser = null;
let currentChat = null;
let currentEffect = 'none';
let socket = null;
let socketConnected = false;
let friendsCache = [];
let requestsCache = [];
let groupsCache = [];
let unreadCounts = {};
let allUsersMap = {};
let allUsersList = [];
let onlineUsers = [];
let isGradientEnabled = false;
let isTypingEnabled = false;
let isHighlightEnabled = false;
let pendingImage = null;
let currentGroupMembers = [];
let currentGroupOwner = '';
let isUserMuted = false;
let isUserBanned = false;
let notificationCount = 0;
let originalTitle = document.title;
let notifications = [];
let isProcessing = false;

let seasonData = {
    tier: 0,
    exp: 0,
    maxExp: 100,
    isElite: false,
    claimedRewards: [],
    claimedElite: [],
    missions: {},
    lastReset: new Date().toISOString()
};

let vipData = {
    isActive: false,
    expiry: null,
    lastClaimDate: null,
    dailyClaimed: false
};

// ============================================================
// DOM REFS
// ============================================================
const messagesEl = document.getElementById('messages');
const sidebarList = document.getElementById('sidebarList');
const msgInput = document.getElementById('msgInput');
const chatTitle = document.getElementById('chatTitle');
const chatSub = document.getElementById('chatSub');
const inputArea = document.getElementById('inputArea');
const chatToolbar = document.getElementById('chatToolbar');
const mutedOverlay = document.getElementById('mutedOverlay');
const mutedBadge = document.getElementById('mutedBadge');
const bannedBadge = document.getElementById('bannedBadge');

// ============================================================
// EFFECT EXPIRY FUNCTIONS
// ============================================================
function getEffectDaysLeft(effectKey) {
    if (!currentUser || !currentUser.seasonEffectsExpiry) return null;
    const expiry = currentUser.seasonEffectsExpiry[effectKey];
    if (!expiry) return null;
    const daysLeft = Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24));
    return daysLeft;
}

function isEffectExpired(effectKey) {
    if (!currentUser || !currentUser.seasonEffectsExpiry) return false;
    const expiry = currentUser.seasonEffectsExpiry[effectKey];
    if (!expiry) return false;
    return Date.now() > expiry;
}

function renderEffectExpiry() {
    const container = document.getElementById('effectExpiryDisplay');
    if (!container || !currentUser) return;
    container.innerHTML = '';
    
    const effects = currentUser.effects || [];
    const expiryData = currentUser.seasonEffectsExpiry || {};
    
    let hasExpiry = false;
    effects.forEach(effect => {
        if (expiryData[effect]) {
            hasExpiry = true;
            const daysLeft = getEffectDaysLeft(effect);
            const isExpired = isEffectExpired(effect);
            const effectInfo = ALL_EFFECTS[effect];
            const effectLabel = effectInfo ? t(effectInfo.label) : effect;
            
            const span = document.createElement('span');
            span.className = 'eff-item';
            if (isExpired) {
                span.innerHTML = `<span class="expired">❌ ${effectLabel} (Hết hạn)</span>`;
            } else if (daysLeft !== null && daysLeft > 0) {
                span.innerHTML = `<span>🎯 ${effectLabel} <span class="days">⏳ ${daysLeft} ngày</span></span>`;
            } else {
                span.innerHTML = `<span>🎯 ${effectLabel}</span>`;
            }
            container.appendChild(span);
        }
    });
    
    if (!hasExpiry) {
        container.innerHTML = '';
    }
}

// ============================================================
// API HELPERS
// ============================================================
const API = {
    async getSession() {
        const res = await fetch('/api/session');
        return res.json();
    },
    async refreshSession() {
        const res = await fetch('/api/refresh-session', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        return res.json();
    },
    async getUsers() {
        const res = await fetch('/api/users');
        return res.json();
    },
    async getAdminUsers(search) {
        const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}`);
        return res.json();
    },
    async getAdminUserDetail(username) {
        const res = await fetch(`/api/admin/user/${username}`);
        return res.json();
    },
    async adminGift(username, type, itemKey) {
        const res = await fetch('/api/admin/gift', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, type, itemKey })
        });
        return res.json();
    },
    async changePassword(username, newPassword) {
        const res = await fetch('/api/admin/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, newPassword })
        });
        return res.json();
    },
    async updateRole(username, role) {
        const res = await fetch('/api/admin/update-role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, role })
        });
        return res.json();
    },
    async getFriends(username) {
        const res = await fetch(`/api/friends/${username}`);
        return res.json();
    },
    async getFriendRequests(username) {
        const res = await fetch(`/api/friend-requests/${username}`);
        return res.json();
    },
    async sendFriendRequest(from, to) {
        const res = await fetch('/api/friend-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, to })
        });
        return res.json();
    },
    async acceptFriendRequest(from, to) {
        const res = await fetch('/api/accept-friend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, to })
        });
        return res.json();
    },
    async removeFriend(username, friend) {
        const res = await fetch(`/api/friend/${username}/${friend}`, { method: 'DELETE' });
        return res.json();
    },
    async getGroups(username) {
        const res = await fetch(`/api/groups/${username}`);
        return res.json();
    },
    async createGroup(creator, name) {
        const res = await fetch('/api/group', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ creator, name })
        });
        return res.json();
    },
    async getGroupMembers(groupId) {
        const res = await fetch(`/api/group-members/${groupId}`);
        return res.json();
    },
    async addMemberToGroup(groupId, userId) {
        const res = await fetch('/api/group/add-member', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId, userId })
        });
        return res.json();
    },
    async removeMemberFromGroup(groupId, userId) {
        const res = await fetch(`/api/group-member/${groupId}/${userId}`, { method: 'DELETE' });
        return res.json();
    },
    async muteMember(groupId, userId) {
        const res = await fetch('/api/group/mute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId, userId })
        });
        return res.json();
    },
    async unmuteMember(groupId, userId) {
        const res = await fetch('/api/group/unmute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId, userId })
        });
        return res.json();
    },
    async banMember(groupId, userId) {
        const res = await fetch('/api/group/ban', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId, userId })
        });
        return res.json();
    },
    async unbanMember(groupId, userId) {
        const res = await fetch('/api/group/unban', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId, userId })
        });
        return res.json();
    },
    async getMessages(chatId) {
        const res = await fetch(`/api/messages/${chatId}`);
        return res.json();
    },
    async deleteMessages(chatId) {
        const res = await fetch(`/api/messages/${chatId}`, { method: 'DELETE' });
        return res.json();
    },

      async buyEffect(username, effectKey) {
        const res = await fetch('/api/store/buy-effect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, effectKey })
        });
        return res.json();
    },
    async setTheme(username, themeKey) {
        const res = await fetch('/api/user/theme', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, themeKey })
        });
        return res.json();
    },
    async setBadge(username, badge) {
        const res = await fetch('/api/user/badge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, badge })
        });
        return res.json();
    },
    async updateUser(username, data) {
        const res = await fetch('/api/user/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, data })
        });
        return res.json();
    },
    async uploadImage(formData) {
        const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
        return res.json();
    },
    async uploadAvatar(formData) {
        const res = await fetch('/api/upload-avatar', { method: 'POST', body: formData });
        return res.json();
    },
    async updateMission(username, type) {
        const res = await fetch('/api/season/update-mission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, type })
        });
        return res.json();
    },
    async getSeasonData(username) {
        const res = await fetch(`/api/season/${username}`);
        return res.json();
    },
    async claimSeasonReward(username, level, isElite) {
        const res = await fetch('/api/season/claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, level, isElite })
        });
        return res.json();
    },
    async upgradePass(username) {
        const res = await fetch('/api/season/upgrade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        return res.json();
    },
    async buyElitePass(username) {
        const res = await fetch('/api/season/buy-elite-pass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        return res.json();
    },
    async claimMission(username, missionId) {
        const res = await fetch('/api/season/claim-mission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, missionId })
        });
        return res.json();
    },
    async getNotifications(username) {
        const res = await fetch(`/api/notifications/${username}`);
        return res.json();
    },
    async markNotificationRead(username, notificationId) {
        const res = await fetch('/api/notifications/mark-read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, notificationId })
        });
        return res.json();
    },
    async markAllNotificationsRead(username) {
        const res = await fetch('/api/notifications/mark-all-read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        return res.json();
    },
    async getUnreadCount(username) {
        const res = await fetch(`/api/notifications/unread-count/${username}`);
        return res.json();
    },
    async activateVIP(username) {
        const res = await fetch('/api/vip/activate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        return res.json();
    },
    async claimVIP(username) {
        const res = await fetch('/api/vip/claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        return res.json();
    },
    async getVIPData(username) {
        const res = await fetch(`/api/vip/${username}`);
        return res.json();
    },
    async checkBirthday(username) {
        const res = await fetch(`/api/user/birthday/${username}`);
        return res.json();
    },
    async claimBirthday(username) {
        const res = await fetch('/api/user/birthday-claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        return res.json();
    },
    async getAchievements(username) {
        const res = await fetch(`/api/achievements/${username}`);
        return res.json();
    }
};

// ============================================================
// SOCKET.IO
// ============================================================
function initSocket() {
    socket = io();
    socket.on('connect', () => {
        socketConnected = true;
        console.log('✅ Socket connected');
        if (currentUser) {
            socket.emit('user-online', currentUser.username);
            loadNotifications();
            loadVIPData();
        }
    });
    socket.on('disconnect', () => {
        socketConnected = false;
        console.log('❌ Socket disconnected');
    });
    socket.on('online-users', (users) => {
        onlineUsers = users;
        renderSidebar();
    });
    
    socket.on('new-message', (data) => {
        console.log('📩 New message received:', data);
        const { chatId, from, text, image, time, effect, mentions, frame, avatarFrame, gradient, typing, highlight } = data;
        if (from === currentUser?.username) return;
        
        const senderData = allUsersMap[from] || {};
        const displayName = senderData.displayName || from;
        const messagePreview = text ? text.substring(0, 50) + (text.length > 50 ? '...' : '') : '[Hình ảnh]';
        
        if (from !== currentUser?.username) {
            const notifData = {
                from: from,
                chatId: chatId,
                message: `${displayName} đã gửi tin nhắn: "${messagePreview}"`
            };
            
            const existingNotif = notifications.find(n => 
                n.type === 'new_message' && 
                n.data?.from === from && 
                n.data?.chatId === chatId &&
                new Date(n.createdAt).getTime() > Date.now() - 5000
            );
            
            if (!existingNotif) {
                addNotificationToUI('new_message', notifData);
                showToast('info', t('toast.new_message', { name: displayName }));
            }
        }
        
        if (currentChat) {
            const currentChatId = getChatId(currentChat.type, currentChat.id);
            if (currentChatId === chatId) {
                renderMessage({ 
                    from, text, image, time, effect, mentions, 
                    frame, avatarFrame, gradient, typing, highlight 
                }, chatId);
                return;
            }
        }
        
        if (chatId) {
            if (!unreadCounts[chatId]) unreadCounts[chatId] = 0;
            unreadCounts[chatId]++;
            renderSidebar();
            if (mentions && mentions.includes(currentUser?.username)) {
                notificationCount++;
                document.title = `(${notificationCount}) 🔔 Chat Pro`;
            }
        }
    });
    
    socket.on('chat-history', (data) => {
        const { chatId, messages } = data;
        if (currentChat) {
            const currentChatId = getChatId(currentChat.type, currentChat.id);
            if (currentChatId === chatId) {
                renderMessages(messages);
            }
        }
    });

    socket.on('member-kicked', (data) => {
        const { groupId, targetUser } = data;
        if (targetUser === currentUser?.username && currentChat?.id === groupId) {
            showToast('error', t('toast.you_were_kicked'));
            loadGroups().then(() => renderSidebar());
        }
        if (currentChat?.id === groupId) refreshGroupMembers();
    });

    socket.on('member-muted', (data) => {
        const { groupId, targetUser } = data;
        if (targetUser === currentUser?.username && currentChat?.id === groupId) {
            isUserMuted = true;
            updateMuteBanUI();
            showToast('warning', t('toast.you_were_muted'));
        }
        if (currentChat?.id === groupId) refreshGroupMembers();
    });

    socket.on('member-unmuted', (data) => {
        const { groupId, targetUser } = data;
        if (targetUser === currentUser?.username && currentChat?.id === groupId) {
            isUserMuted = false;
            updateMuteBanUI();
            showToast('success', t('toast.you_were_unmuted'));
        }
        if (currentChat?.id === groupId) refreshGroupMembers();
    });

    socket.on('member-banned', (data) => {
        const { groupId, targetUser } = data;
        if (targetUser === currentUser?.username && currentChat?.id === groupId) {
            isUserBanned = true;
            updateMuteBanUI();
            showToast('error', t('toast.you_were_banned'));
            loadGroups().then(() => renderSidebar());
        }
        if (currentChat?.id === groupId) refreshGroupMembers();
    });

    socket.on('member-unbanned', (data) => {
        const { groupId, targetUser } = data;
        if (targetUser === currentUser?.username && currentChat?.id === groupId) {
            isUserBanned = false;
            updateMuteBanUI();
            showToast('success', t('toast.you_were_unbanned'));
        }
        if (currentChat?.id === groupId) refreshGroupMembers();
    });

    socket.on('group-updated', (data) => {
        if (currentChat?.id === data.groupId) {
            refreshGroupMembers();
            loadGroups().then(() => renderSidebar());
        }
    });
    
    socket.on('user-updated', (data) => {
        console.log('📦 User updated event:', data);
        if (data.username === currentUser?.username) {
            if (data.fullUser) {
                const oldUser = JSON.stringify(currentUser);
                const newUser = JSON.stringify(data.fullUser);
                if (oldUser !== newUser) {
                    currentUser = data.fullUser;
                    updateUserUI(currentUser);
                    renderSidebar();
                    renderEffectExpiry();
                    sessionStorage.setItem('chat_user', JSON.stringify(currentUser));
                    showToast('success', t('toast.account_updated'));
                } else {
                    currentUser = data.fullUser;
                    updateUserUI(currentUser);
                    renderSidebar();
                    renderEffectExpiry();
                    sessionStorage.setItem('chat_user', JSON.stringify(currentUser));
                }
            } else {
                refreshSessionData();
            }
        } else {
            if (data.fullUser) {
                allUsersMap[data.username] = data.fullUser;
                loadAllUsers();
                renderSidebar();
            }
        }
    });
    
    socket.on('force-refresh-user', (data) => {
        console.log('🔄 Force refresh user:', data);
        if (data.username === currentUser?.username) {
            refreshSessionData();
            loadVIPData();
        } else {
            loadAllUsers();
            renderSidebar();
        }
    });

    socket.on('season-updated', (data) => {
        console.log('📦 Season updated:', data);
        if (data.username === currentUser?.username) {
            if (data.seasonData) {
                seasonData = data.seasonData;
                renderSeasonPass();
                renderMissions();
                renderEffectExpiry();
                showToast('success', t('toast.mission_updated'));
            }
        }
    });

    socket.on('cash-updated', (data) => {
        console.log('💰 Cash updated realtime:', data);
        if (data.username === currentUser?.username) {
            if (data.newCash !== undefined) {
                const oldCash = currentUser.cash || 0;
                const amount = data.amount || (data.newCash - oldCash);
                currentUser.cash = data.newCash;
                
                document.getElementById('userCash').textContent = data.newCash.toLocaleString();
                sessionStorage.setItem('chat_user', JSON.stringify(currentUser));
                if (allUsersMap[currentUser.username]) {
                    allUsersMap[currentUser.username].cash = data.newCash;
                }
                renderSidebar();
                showToast('success', t('toast.cash_received', { amount: (amount || 0).toLocaleString() }));
            }
        }
    });

    socket.on('new-notification', (notification) => {
        console.log('🔔 New notification:', notification);
        addNotificationToUI(notification.type, notification.data);
        
        const type = notification.type;
        const data = notification.data;
        if (type === 'friend_request') {
            showToast('info', t('toast.friend_request_received', { name: data.from }));
        } else if (type === 'friend_accepted') {
            showToast('success', t('toast.friend_accepted', { name: data.from }));
        } else if (type === 'gift_received') {
            showToast('success', t('toast.gift_received', { name: data.from, item: data.itemLabel || data.item }));
        } else if (type === 'mention') {
            showToast('info', t('toast.mention', { name: data.from }));
        } else if (type === 'achievement') {
            showToast('success', t('toast.achievement_unlocked', { name: data.name }));
        } else if (type === 'group_kick' || type === 'group_ban') {
            showToast('error', data.message);
        } else if (type === 'group_mute') {
            showToast('warning', data.message);
        } else if (type === 'group_unmute' || type === 'group_unban') {
            showToast('success', data.message);
        }
    });

    socket.on('notification-count', (count) => {
        console.log('🔔 Notification count:', count);
        notificationCount = count || 0;
        updateNotificationBadge();
    });

    socket.on('force-update-sidebar', (data) => {
        console.log('🔄 Force update sidebar:', data);
        if (data.username === currentUser?.username) {
            renderSidebar();
            renderEffectExpiry();
            refreshSessionData();
            loadVIPData();
        }
    });

    socket.on('vip-updated', (data) => {
        console.log('👑 VIP updated:', data);
        if (data.username === currentUser?.username) {
            vipData = data.vipData || data;
            updateVIPUI();
            if (document.getElementById('vipModal').classList.contains('show')) {
                renderVIPModal();
            }
        }
    });

    socket.on('achievement-unlocked', (data) => {
        if (data.username === currentUser?.username) {
            showToast('success', t('toast.achievement_unlocked', { name: data.name }));
            // Cập nhật achievements
            loadAchievements();
            updateAchievementUI();
        }
    });
}

// ============================================================
// NOTIFICATION FUNCTIONS
// ============================================================
function addNotificationToUI(type, data) {
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
    updateNotificationBadge();
    renderNotifications();
}

async function loadNotifications() {
    try {
        const result = await API.getNotifications(currentUser.username);
        if (result && result.success) {
            notifications = result.notifications || [];
            updateNotificationBadge();
            renderNotifications();
        }
    } catch (e) {
        console.error('Load notifications error:', e);
    }
}

function updateNotificationBadge() {
    const badge = document.getElementById('notifBadge');
    if (!badge) return;
    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

function renderNotifications() {
    const container = document.getElementById('notificationList');
    if (!container) return;
    container.innerHTML = '';
    
    if (notifications.length === 0) {
        container.innerHTML = '<div style="color:rgba(255,255,255,0.3);text-align:center;padding:40px 0;"><i class="fas fa-bell-slash"></i> Không có thông báo</div>';
        return;
    }
    
    notifications.forEach(notif => {
        const div = document.createElement('div');
        div.className = `notification-item ${!notif.read ? 'unread' : ''}`;
        
        let icon = '🔔';
        let text = notif.data?.message || 'Thông báo';
        let time = formatTime(notif.createdAt);
        
        switch (notif.type) {
            case 'friend_request': icon = '👤'; break;
            case 'friend_accepted': icon = '🤝'; break;
            case 'gift_received': icon = '🎁'; break;
            case 'mention': icon = '💬'; break;
            case 'new_message': icon = '💬'; break;
            case 'achievement': icon = '🏆'; break;
            case 'group_kick': icon = '🚫'; break;
            case 'group_ban': icon = '⛔'; break;
            case 'group_mute': icon = '🔇'; break;
            case 'group_unmute': icon = '🔊'; break;
            case 'group_unban': icon = '✅'; break;
            default: icon = '🔔';
        }
        
        div.innerHTML = `
            <div class="notif-icon">${icon}</div>
            <div class="notif-content">
                <div class="notif-text">${text}</div>
                <div class="notif-time">${time}</div>
            </div>
            <div class="notif-actions">
                ${!notif.read ? `<button class="mark-read-btn" onclick="markNotificationRead('${notif.id}')">Đã đọc</button>` : ''}
            </div>
        `;
        container.appendChild(div);
    });
}

async function markNotificationRead(notificationId) {
    try {
        const result = await API.markNotificationRead(currentUser.username, notificationId);
        if (result && result.success) {
            const notif = notifications.find(n => n.id === notificationId);
            if (notif) notif.read = true;
            updateNotificationBadge();
            renderNotifications();
        }
    } catch (e) {
        console.error('Mark notification read error:', e);
    }
}

async function markAllNotificationsRead() {
    try {
        const result = await API.markAllNotificationsRead(currentUser.username);
        if (result && result.success) {
            notifications.forEach(n => n.read = true);
            updateNotificationBadge();
            renderNotifications();
            showToast('success', 'Đã đánh dấu tất cả thông báo đã đọc!');
        }
    } catch (e) {
        console.error('Mark all notifications read error:', e);
        showToast('error', 'Lỗi đánh dấu đã đọc');
    }
}

function openNotifications() {
    renderNotifications();
    openModal('notificationModal');
}

// ============================================================
// VIP FUNCTIONS
// ============================================================
async function loadVIPData() {
    try {
        const result = await API.getVIPData(currentUser.username);
        if (result && result.success) {
            vipData = result.data;
            updateVIPUI();
        }
    } catch (e) {
        console.error('Load VIP data error:', e);
    }
}

function updateVIPUI() {
    const badge = document.getElementById('vipSidebarBadge');
    if (badge) {
        if (vipData.isActive) {
            badge.style.display = 'inline';
            badge.textContent = '👑 VIP';
        } else {
            badge.style.display = 'none';
        }
    }
    
    const vipBtn = document.getElementById('vipBtn');
    if (vipBtn) {
        if (vipData.isActive) {
            vipBtn.style.display = 'flex';
            vipBtn.className = 'vip-btn active-vip';
            vipBtn.innerHTML = `<i class="fas fa-crown" style="color:#ffd700;"></i> <span>VIP</span>`;
        } else {
            vipBtn.style.display = 'flex';
            vipBtn.className = 'vip-btn';
            vipBtn.innerHTML = `<i class="fas fa-crown"></i> <span>VIP</span>`;
        }
    }
}

function renderVIPModal() {
    const statusEl = document.getElementById('vipModalStatus');
    const expiryEl = document.getElementById('vipModalExpiry');
    const dailyEl = document.getElementById('vipModalDaily');
    const claimBtn = document.getElementById('vipModalClaimBtn');
    const buyBtn = document.getElementById('vipModalBuyBtn');
    
    if (vipData.isActive) {
        statusEl.textContent = '✅ Đã kích hoạt';
        statusEl.className = 'vip-status-active';
        expiryEl.textContent = vipData.expiry ? new Date(vipData.expiry).toLocaleDateString('vi-VN') : 'Vĩnh viễn';
        dailyEl.textContent = vipData.dailyClaimed ? '✅ Đã nhận' : '🎁 Sẵn sàng';
        dailyEl.className = vipData.dailyClaimed ? 'vip-daily-claimed' : 'vip-daily-ready';
        claimBtn.disabled = vipData.dailyClaimed;
        claimBtn.textContent = vipData.dailyClaimed ? '✅ Đã nhận hôm nay' : '🎁 Nhận thưởng (2,000 💵)';
        buyBtn.textContent = '🔄 Gia hạn VIP (200,000 💵)';
    } else {
        statusEl.textContent = '❌ Chưa kích hoạt';
        statusEl.className = 'vip-status-inactive';
        expiryEl.textContent = '--';
        dailyEl.textContent = '--';
        dailyEl.className = '';
        claimBtn.disabled = true;
        claimBtn.textContent = '🔒 Nhận thưởng VIP';
        buyBtn.textContent = '👑 Đăng ký VIP (200,000 💵)';
    }
}

function openVIPModal() {
    renderVIPModal();
    openModal('vipModal');
}

async function activateVIP() {
    if (!currentUser || isProcessing) return;
    const price = 200000;
    if (currentUser.cash < price) {
        showToast('error', t('toast.not_enough_money', { price: price.toLocaleString() }));
        return;
    }
    if (!confirm(`Đăng ký VIP với giá ${price.toLocaleString()} 💵?`)) return;
    isProcessing = true;
    try {
        const result = await API.activateVIP(currentUser.username);
        if (result && result.success) {
            showToast('success', t('toast.vip_activated'));
            currentUser = result.user;
            vipData = result.vipData;
            updateUserUI(currentUser);
            updateVIPUI();
            renderVIPModal();
            updateSessionStorage(currentUser);
            closeModal('vipModal');
        } else {
            showToast('error', result?.msg || 'Lỗi kích hoạt VIP');
        }
    } catch (e) {
        showToast('error', 'Lỗi kích hoạt VIP: ' + e.message);
    }
    isProcessing = false;
}

async function claimVIPReward() {
    if (!currentUser || isProcessing) return;
    if (!vipData.isActive) {
        showToast('error', t('toast.vip_not_active'));
        return;
    }
    if (vipData.dailyClaimed) {
        showToast('info', t('toast.vip_already_claimed'));
        return;
    }
    isProcessing = true;
    try {
        const result = await API.claimVIP(currentUser.username);
        if (result && result.success) {
            showToast('success', t('toast.vip_claimed'));
            currentUser = result.user;
            vipData = result.vipData;
            updateUserUI(currentUser);
            updateVIPUI();
            renderVIPModal();
            updateSessionStorage(currentUser);
        } else {
            showToast('error', result?.msg || 'Lỗi nhận thưởng VIP');
        }
    } catch (e) {
        showToast('error', 'Lỗi nhận thưởng VIP: ' + e.message);
    }
    isProcessing = false;
}

// ============================================================
// REFRESH SESSION
// ============================================================
async function refreshSessionData() {
    try {
        const result = await API.refreshSession();
        if (result && result.success && result.user) {
            currentUser = result.user;
            updateUserUI(currentUser);
            renderSidebar();
            renderEffectExpiry();
            sessionStorage.setItem('chat_user', JSON.stringify(currentUser));
            return true;
        }
        return false;
    } catch (e) {
        console.error('Refresh session error:', e);
        return false;
    }
}

// ============================================================
// MUTE/BAN UI FUNCTIONS
// ============================================================
function updateMuteBanUI() {
    const isGroup = currentChat?.type === 'group' && currentChat?.id !== 'chat_chung';
    
    if (isGroup) {
        if (isUserBanned) {
            if (inputArea) inputArea.classList.add('banned');
            if (chatToolbar) chatToolbar.classList.add('muted');
            if (mutedOverlay) {
                mutedOverlay.classList.add('show');
                const icon = mutedOverlay.querySelector('.icon');
                if (icon) icon.textContent = '🚫';
                const title = document.getElementById('mutedOverlayTitle');
                if (title) title.textContent = t('chat.banned');
                const desc = document.getElementById('mutedOverlayDesc');
                if (desc) desc.textContent = t('chat.banned_desc');
            }
            if (bannedBadge) bannedBadge.style.display = 'inline-block';
            if (mutedBadge) mutedBadge.style.display = 'none';
            return;
        }
        
        if (isUserMuted) {
            if (inputArea) inputArea.classList.add('muted');
            if (chatToolbar) chatToolbar.classList.add('muted');
            if (mutedOverlay) {
                mutedOverlay.classList.add('show');
                const icon = mutedOverlay.querySelector('.icon');
                if (icon) icon.textContent = '🔇';
                const title = document.getElementById('mutedOverlayTitle');
                if (title) title.textContent = t('chat.muted');
                const desc = document.getElementById('mutedOverlayDesc');
                if (desc) desc.textContent = t('chat.muted_desc');
            }
            if (mutedBadge) mutedBadge.style.display = 'inline-block';
            if (bannedBadge) bannedBadge.style.display = 'none';
            return;
        }
    }
    
    if (inputArea) inputArea.classList.remove('muted', 'banned');
    if (chatToolbar) chatToolbar.classList.remove('muted');
    if (mutedOverlay) mutedOverlay.classList.remove('show');
    if (mutedBadge) mutedBadge.style.display = 'none';
    if (bannedBadge) bannedBadge.style.display = 'none';
}

// ============================================================
// RENDER FUNCTIONS
// ============================================================
function renderSidebar() {
    if (!currentUser) return;
    const tab = document.querySelector('.sidebar .tabs .active');
    if (!tab) return;
    if (tab.id === 'tabFriends') renderFriendsList();
    else if (tab.id === 'tabGroups') renderGroupsList();
}

function renderFriendsList() {
    if (!sidebarList) return;
    sidebarList.innerHTML = '';
    
    const pendingRequests = requestsCache.filter(r => r.to === currentUser.username && r.status === 'pending');
    if (pendingRequests.length > 0) {
        pendingRequests.forEach(req => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <div class="avatar-wrapper"><div class="avatar" style="background:#f7971e;">${req.from[0].toUpperCase()}</div></div>
                <div class="info"><div class="name">${req.from} <span style="font-size:0.6rem;color:#f7971e;">(${t('sidebar.pending')})</span></div></div>
                <div class="actions">
                    <button onclick="acceptFriend('${req.from}')" style="color:#2ecc71;"><i class="fas fa-check"></i></button>
                    <button onclick="rejectFriend('${req.from}')" style="color:#e74c3c;"><i class="fas fa-times"></i></button>
                </div>
            `;
            sidebarList.appendChild(div);
        });
    }

    const friends = friendsCache.filter(f => f !== currentUser.username);
    if (friends.length === 0 && pendingRequests.length === 0) {
        sidebarList.innerHTML = `<div style="color:rgba(255,255,255,0.3);text-align:center;padding:40px 0;">${t('sidebar.no_friends')}</div>`;
        return;
    }

    friends.forEach(friend => {
        const isOnline = onlineUsers.includes(friend);
        const div = document.createElement('div');
        const isActive = currentChat?.id === friend && currentChat?.type === 'friend';
        div.className = `item ${isActive ? 'active' : ''}`;
        const unread = unreadCounts[getChatId('friend', friend)] || 0;
        const userData = allUsersMap[friend] || {};
        const displayName = userData.displayName || friend;
        const avatarUrl = userData.avatarUrl || null;
        const roleDisplay = getRoleDisplay(userData);
        const avatarFrame = userData.currentAvatarFrame || 'default';
        const frameClass = getAvatarFrameClass(avatarFrame);
        
        div.innerHTML = `
            <div class="avatar-wrapper">
                <div class="avatar">${avatarUrl ? `<img src="${avatarUrl}" alt="${friend}">` : friend[0].toUpperCase()}</div>
                <div class="avt-frame ${frameClass}"></div>
            </div>
            <div class="info">
                <div class="name">${displayName} <span class="role-badge ${roleDisplay.className}" style="font-size:0.5rem;">${roleDisplay.label}</span> ${isOnline ? '<span style="color:#2ecc71;font-size:0.5rem;">●</span>' : ''}</div>
                <div class="status ${isOnline ? 'online' : ''}">${isOnline ? t('sidebar.online') : 'Offline'}</div>
            </div>
            ${unread > 0 ? `<span class="unread-badge">${unread}</span>` : ''}
            <div class="actions"><button onclick="removeFriend('${friend}')"><i class="fas fa-user-minus"></i></button></div>
        `;
        div.addEventListener('click', () => {
            openChat('friend', friend, displayName, avatarUrl);
        });
        sidebarList.appendChild(div);
    });
}

function getAvatarFrameClass(frameKey) {
    const map = {
        'default': 'default-frame',
        'avtframe1': 'gold-frame',
        'avtframe2': 'platinum-frame',
        'avtframe3': 'diamond-frame',
        'avtframe4': 'rainbow-frame',
        'avtframe5': 'cosmic-frame',
        'avtframe6': 'inferno-frame'
    };
    return map[frameKey] || 'default-frame';
}

function renderGroupsList() {
    if (!sidebarList) return;
    sidebarList.innerHTML = '';
    
    let groups = [...groupsCache];
    const hasChatChung = groups.some(g => g.id === 'chat_chung');
    if (!hasChatChung) {
        groups.push({
            id: 'chat_chung',
            name: '💬 Chat Chung',
            avatar: '💬',
            isPermanent: true,
            memberCount: 0
        });
    }
    
    if (groups.length === 0) {
        sidebarList.innerHTML = `<div style="color:rgba(255,255,255,0.3);text-align:center;padding:40px 0;">${t('sidebar.no_groups')}</div>`;
        return;
    }
    
    groups.sort((a, b) => {
        if (a.id === 'chat_chung') return -1;
        if (b.id === 'chat_chung') return 1;
        return 0;
    });

    groups.forEach(group => {
        const isActive = currentChat?.id === group.id && currentChat?.type === 'group';
        const unread = unreadCounts[getChatId('group', group.id)] || 0;
        const isChatChung = group.id === 'chat_chung';
        const div = document.createElement('div');
        div.className = `item ${isActive ? 'active' : ''}`;
        
        div.innerHTML = `
            <div class="avatar-wrapper">
                <div class="avatar" style="background:${isChatChung ? 'rgba(46,204,113,0.2)' : 'rgba(247,151,30,0.2)'};">
                    ${isChatChung ? '💬' : (group.avatar || '👥')}
                </div>
            </div>
            <div class="info">
                <div class="name">${isChatChung ? '💬 Chat Chung' : group.name}</div>
                <div class="status">${isChatChung ? '🌐 ' + t('chat.group_chat') : (group.memberCount ? `${group.memberCount} ${t('chat.members')}` : '')}</div>
            </div>
            ${unread > 0 ? `<span class="unread-badge">${unread}</span>` : ''}
        `;
        div.addEventListener('click', () => {
            const displayName = isChatChung ? '💬 Chat Chung' : group.name;
            openChat('group', group.id, displayName, null, group);
        });
        sidebarList.appendChild(div);
    });
}

function getRoleDisplay(user) {
    if (!user) return { label: 'User', className: 'user' };
    const role = user.role || 'user';
    const map = {
        'owner': { label: t('role.owner'), className: 'owner' },
        'admin': { label: t('role.admin'), className: 'admin' },
        'manager': { label: t('role.manager'), className: 'manager' },
        'support': { label: t('role.support'), className: 'support' },
        'legend': { label: t('role.legend'), className: 'legend' },
        'vip': { label: t('role.vip'), className: 'vip' },
        'diamond': { label: t('role.diamond'), className: 'diamond' },
        'platinum': { label: t('role.platinum'), className: 'platinum' },
        'gold': { label: t('role.gold'), className: 'gold' },
        'silver': { label: t('role.silver'), className: 'silver' },
        'bronze': { label: t('role.bronze'), className: 'bronze' },
        'user': { label: t('role.user'), className: 'user' }
    };
    return map[role] || map.user;
}

function renderMessages(messages) {
    if (!messagesEl) return;
    messagesEl.innerHTML = '';
    if (!messages || messages.length === 0) {
        messagesEl.innerHTML = `<div style="color:rgba(255,255,255,0.2);text-align:center;padding:40px 0;">${t('chat.no_messages')}</div>`;
        return;
    }
    messages.forEach(msg => renderMessage(msg, currentChat?.id));
    scrollToBottom();
}

// ============================================================
// RENDER MESSAGE - UPDATED EFFECTS
// ============================================================
function renderMessage(msg, chatId) {
    if (!messagesEl) return;
    const isMe = msg.from === currentUser?.username;
    
    const wrapper = document.createElement('div');
    wrapper.className = `msg-wrapper ${isMe ? 'me' : 'other'}`;
    
    // Avatar
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'avatar-msg';
    const senderData = allUsersMap[msg.from] || {};
    const avatarUrl = senderData.avatarUrl || null;
    const displayName = senderData.displayName || msg.from || '?';
    const avatarFrame = msg.avatarFrame || senderData.currentAvatarFrame || 'default';
    
    if (avatarUrl) {
        const img = document.createElement('img');
        img.src = avatarUrl;
        img.alt = displayName;
        avatarDiv.appendChild(img);
    } else {
        const textSpan = document.createElement('span');
        textSpan.className = 'avatar-text-msg';
        textSpan.textContent = displayName.charAt(0).toUpperCase();
        avatarDiv.appendChild(textSpan);
    }
    
    const frameClass = getAvatarFrameClass(avatarFrame);
    const frameDiv = document.createElement('div');
    frameDiv.className = 'avt-frame-msg ' + frameClass;
    avatarDiv.appendChild(frameDiv);
    wrapper.appendChild(avatarDiv);
    
    // Message content
    const div = document.createElement('div');
    div.className = 'msg';
    
    if (!isMe && allUsersMap[msg.from]?.msgColor) {
        div.style.backgroundColor = allUsersMap[msg.from].msgColor + '40';
        div.style.borderColor = allUsersMap[msg.from].msgColor + '80';
        div.style.border = '1px solid ' + allUsersMap[msg.from].msgColor + '80';
    }

    // Frame
    const frameKey = msg.frame || 'default';
    if (frameKey && frameKey !== 'default') {
        div.classList.add(frameKey);
    }

    // Gradient
    if (msg.gradient || (isMe && currentUser?.gradientText)) {
        div.classList.add('gradient-text');
    }
    
    // Typing
    if (msg.typing || (isMe && currentUser?.typingEffect)) {
        div.classList.add('typing-effect');
    }

    // EFFECTS
    const effectKey = msg.effect || 'none';
    if (effectKey && effectKey !== 'none') {
        const senderEffects = allUsersMap[msg.from]?.effects || [];
        if (senderEffects.includes(effectKey) || isMe) {
            div.classList.add('effect-' + effectKey);
            
            // ============================================================
            // EFFECT: AURORA (Cực quang)
            // ============================================================
            if (effectKey === 'aurora') {
                const emoji1 = document.createElement('div');
                emoji1.className = 'aurora-emoji top-left flying';
                emoji1.textContent = '🌌';
                emoji1.style.fontSize = '0.9rem';
                div.appendChild(emoji1);
                
                const emoji2 = document.createElement('div');
                emoji2.className = 'aurora-emoji bottom-right flying';
                emoji2.textContent = '🌠';
                emoji2.style.fontSize = '0.9rem';
                div.appendChild(emoji2);
                
                setTimeout(() => {
                    emoji1.classList.remove('flying');
                    emoji2.classList.remove('flying');
                    emoji1.style.animation = 'auroraFloat 2s ease-in-out infinite';
                    emoji2.style.animation = 'auroraFloat 2s ease-in-out infinite 0.5s';
                }, 1500);
            }
            
            // ============================================================
            // EFFECT: STARLIGHT (Ánh sao)
            // ============================================================
            else if (effectKey === 'starlight') {
                const starEmojis = ['⭐', '✨', '🌟', '💫'];
                const positions = [
                    { top: '-6px', left: '50%' },
                    { top: '50%', right: '-6px' },
                    { top: 'calc(100% + 2px)', left: '50%' },
                    { top: '50%', left: '-6px' },
                    { top: '-3px', left: '15%' },
                    { top: '-3px', right: '15%' },
                    { top: 'calc(100% + 4px)', left: '15%' },
                    { top: 'calc(100% + 4px)', right: '15%' }
                ];
                const starSizes = ['0.7rem', '0.9rem', '0.8rem', '1rem', '0.6rem', '0.8rem', '0.7rem', '0.9rem'];
                const delays = ['0s', '0.5s', '1s', '1.5s', '0.25s', '0.75s', '1.25s', '1.75s'];
                const orbitRadii = [30, 35, 25, 40, 28, 32, 26, 38];
                
                for (let i = 0; i < 8; i++) {
                    const star = document.createElement('div');
                    star.className = `star-particle particle-${i+1}`;
                    star.style.position = 'absolute';
                    star.style.top = positions[i].top;
                    star.style.left = positions[i].left || 'auto';
                    star.style.right = positions[i].right || 'auto';
                    star.style.transform = 'translate(-50%, -50%)';
                    star.style.pointerEvents = 'none';
                    star.style.zIndex = '10';
                    star.style.fontSize = starSizes[i];
                    star.style.setProperty('--orbit-radius', orbitRadii[i] + 'px');
                    star.style.setProperty('--start-angle', (i * 45) + 'deg');
                    
                    const twinkle = document.createElement('span');
                    twinkle.className = 'twinkle-star';
                    twinkle.textContent = starEmojis[i % starEmojis.length];
                    twinkle.style.animationDelay = delays[i];
                    twinkle.style.display = 'inline-block';
                    star.appendChild(twinkle);
                    div.appendChild(star);
                }
                
                let styleEl = document.getElementById('starlight-global-style');
                if (!styleEl) {
                    styleEl = document.createElement('style');
                    styleEl.id = 'starlight-global-style';
                    styleEl.textContent = `
                        .msg.effect-starlight .star-particle {
                            animation: starlightOrbit 4s linear infinite;
                        }
                        .msg.effect-starlight .star-particle:nth-child(1) { animation-delay: 0s; }
                        .msg.effect-starlight .star-particle:nth-child(2) { animation-delay: 0.5s; }
                        .msg.effect-starlight .star-particle:nth-child(3) { animation-delay: 1s; }
                        .msg.effect-starlight .star-particle:nth-child(4) { animation-delay: 1.5s; }
                        .msg.effect-starlight .star-particle:nth-child(5) { animation-delay: 0.25s; }
                        .msg.effect-starlight .star-particle:nth-child(6) { animation-delay: 0.75s; }
                        .msg.effect-starlight .star-particle:nth-child(7) { animation-delay: 1.25s; }
                        .msg.effect-starlight .star-particle:nth-child(8) { animation-delay: 1.75s; }
                        
                        @keyframes starlightOrbit {
                            0% { 
                                transform: translate(-50%, -50%) rotate(var(--start-angle, 0deg)) translateX(var(--orbit-radius, 30px)) rotate(calc(-1 * var(--start-angle, 0deg))) scale(0.5); 
                                opacity: 0.3; 
                            }
                            50% { 
                                transform: translate(-50%, -50%) rotate(calc(var(--start-angle, 0deg) + 180deg)) translateX(var(--orbit-radius, 30px)) rotate(calc(-1 * var(--start-angle, 0deg) - 180deg)) scale(1.2); 
                                opacity: 1; 
                            }
                            100% { 
                                transform: translate(-50%, -50%) rotate(calc(var(--start-angle, 0deg) + 360deg)) translateX(var(--orbit-radius, 30px)) rotate(calc(-1 * var(--start-angle, 0deg) - 360deg)) scale(0.5); 
                                opacity: 0.3; 
                            }
                        }
                    `;
                    document.head.appendChild(styleEl);
                }
            }
            
            // ============================================================
            // EFFECT: GALAXY (Thiên hà)
            // ============================================================
            else if (effectKey === 'galaxy') {
                const galaxyContainer = document.createElement('div');
                galaxyContainer.className = 'galaxy-container';
                galaxyContainer.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    z-index: 0;
                    overflow: hidden;
                    border-radius: 16px;
                `;
                
                const colors = ['#8b5cf6', '#6d28d9', '#7c3aed', '#a855f7', '#c084fc', '#4c1d95', '#9333ea', '#7e22ce'];
                const particleCount = 20;
                
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'galaxy-particle';
                    const size = 3 + Math.random() * 6;
                    const left = Math.random() * 100;
                    const delay = Math.random() * 3;
                    const duration = 1.5 + Math.random() * 2;
                    const drift = (Math.random() - 0.5) * 60;
                    
                    particle.style.cssText = `
                        position: absolute;
                        bottom: -10px;
                        left: ${left}%;
                        width: ${size}px;
                        height: ${size}px;
                        background: ${colors[i % colors.length]};
                        border-radius: 50%;
                        box-shadow: 0 0 ${size * 2}px ${colors[i % colors.length]};
                        animation: galaxyRise ${duration}s ease-out infinite;
                        animation-delay: ${delay}s;
                        pointer-events: none;
                        opacity: 0;
                        --drift: ${drift}px;
                    `;
                    galaxyContainer.appendChild(particle);
                }
                
                div.appendChild(galaxyContainer);
            }
            
            // ============================================================
            // EFFECT: SHIMMER (Sáng bóng)
            // ============================================================
            else if (effectKey === 'shimmer') {
                for (let i = 0; i < 3; i++) {
                    const sparkle = document.createElement('div');
                    sparkle.className = 'sparkle';
                    sparkle.style.left = (10 + Math.random() * 80) + '%';
                    sparkle.style.top = (10 + Math.random() * 80) + '%';
                    sparkle.style.animationDelay = (i * 0.5) + 's';
                    div.appendChild(sparkle);
                }
            }
            
            // ============================================================
            // EFFECT: FIRE (Lửa)
            // ============================================================
            else if (effectKey === 'fire') {
                const flame = document.createElement('div');
                flame.className = 'fire-flame';
                flame.textContent = '🔥';
                div.appendChild(flame);
            }
            
            // ============================================================
            // EFFECT: EXPLODE (Nổ)
            // ============================================================
            else if (effectKey === 'explode') {
                const explosion = document.createElement('div');
                explosion.className = 'explosion';
                const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bff'];
                for (let i = 0; i < 12; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    const angle = (i / 12) * 360;
                    const distance = 40 + Math.random() * 40;
                    particle.style.setProperty('--tx', Math.cos(angle * Math.PI / 180) * distance + 'px');
                    particle.style.setProperty('--ty', Math.sin(angle * Math.PI / 180) * distance + 'px');
                    particle.style.background = colors[i % colors.length];
                    particle.style.width = (4 + Math.random() * 6) + 'px';
                    particle.style.height = particle.style.width;
                    particle.style.animationDelay = (Math.random() * 0.3) + 's';
                    explosion.appendChild(particle);
                }
                div.appendChild(explosion);
            }
            
            // ============================================================
            // EFFECT: RAINBOW (Cầu vồng)
            // ============================================================
            else if (effectKey === 'rainbow') {
                div.style.color = '#ffffff';
                const rainbowBg = document.createElement('div');
                rainbowBg.className = 'rainbow-bg';
                const rainbowGradient = document.createElement('div');
                rainbowGradient.className = 'rainbow-gradient';
                rainbowBg.appendChild(rainbowGradient);
                const overlayDark = document.createElement('div');
                overlayDark.className = 'rainbow-overlay-dark';
                rainbowBg.appendChild(overlayDark);
                div.prepend(rainbowBg);
            }
            
            // ============================================================
            // EFFECT: TWINKLE, GLOW, BUBBLE, DRAGON - Đã có trong CSS
            // ============================================================
        }
    }

    // Highlight
    if (msg.highlight || (msg.mentions && msg.mentions.includes(currentUser?.username) && !isMe)) {
        div.classList.add('highlighted');
    }

    // Sender name
    if (!isMe && msg.from) {
        const sender = document.createElement('div');
        sender.className = 'sender';
        sender.textContent = displayName;
        div.appendChild(sender);
    }

    // Content
    const content = document.createElement('div');
    content.className = 'text-content';
    
    if (msg.text) {
        let text = msg.text;
        const mentionRegex = /@(\w+)/g;
        let match, lastIndex = 0, fragments = [];
        while ((match = mentionRegex.exec(text)) !== null) {
            const mentionName = match[1];
            if (mentionName) {
                fragments.push(text.substring(lastIndex, match.index));
                const span = document.createElement('span');
                span.className = mentionName === currentUser?.username ? 'mention-me' : 'mention';
                span.textContent = '@' + mentionName;
                fragments.push(span.outerHTML);
                lastIndex = match.index + match[0].length;
            }
        }
        if (lastIndex < text.length) fragments.push(text.substring(lastIndex));
        content.innerHTML = fragments.join('');
    }

    if (msg.image) {
        const img = document.createElement('img');
        img.className = 'msg-image';
        img.src = msg.image;
        img.alt = 'Image';
        img.loading = 'lazy';
        img.addEventListener('click', () => {
            const previewImage = document.getElementById('previewImage');
            if (previewImage) previewImage.src = msg.image;
            openModal('imagePreviewModal');
        });
        content.appendChild(img);
    }

    div.appendChild(content);

    if (msg.time) {
        const time = document.createElement('div');
        time.className = 'time';
        time.textContent = formatTime(msg.time);
        div.appendChild(time);
    }

    wrapper.appendChild(div);
    messagesEl.appendChild(wrapper);
    scrollToBottom();
}

// ============================================================
// CHAT FUNCTIONS
// ============================================================
function getChatId(type, id) {
    if (type === 'friend') {
        if (id === 'ai') return 'ai';
        return `private_${[currentUser.username, id].sort().join('_')}`;
    }
    return `group_${id}`;
}

async function openChat(type, id, name, avatar, groupData) {
    if (!socket) return;
    
    isUserMuted = false;
    isUserBanned = false;
    
    if (currentChat?.id) {
        socket.emit('leave-room', getChatId(currentChat.type, currentChat.id));
    }

    const chatId = getChatId(type, id);
    currentChat = { id, type, name };
    
    if (chatTitle) chatTitle.textContent = name;
    if (chatSub) {
        if (type === 'friend') {
            chatSub.textContent = '💬 ' + t('chat.private_chat');
            const user = allUsersMap[id];
            const chatAvatarImage = document.getElementById('chatAvatarImage');
            const chatAvatarText = document.getElementById('chatAvatarText');
            if (user?.avatarUrl) {
                if (chatAvatarImage) {
                    chatAvatarImage.src = user.avatarUrl;
                    chatAvatarImage.style.display = 'block';
                }
                if (chatAvatarText) chatAvatarText.style.display = 'none';
            } else {
                if (chatAvatarImage) chatAvatarImage.style.display = 'none';
                if (chatAvatarText) {
                    chatAvatarText.style.display = 'flex';
                    chatAvatarText.textContent = id ? id[0].toUpperCase() : '?';
                }
            }
            const frameKey = user?.currentAvatarFrame || 'default';
            const frameClass = getAvatarFrameClass(frameKey);
            const chatAvatarFrame = document.getElementById('chatAvatarFrame');
            if (chatAvatarFrame) {
                chatAvatarFrame.className = 'avt-frame ' + frameClass;
                chatAvatarFrame.style.display = 'block';
            }
            const addMemberBtn = document.getElementById('addMemberBtn');
            if (addMemberBtn) addMemberBtn.style.display = 'none';
            const viewMembersBtn = document.getElementById('viewMembersBtn');
            if (viewMembersBtn) viewMembersBtn.style.display = 'none';
            const leaveGroupBtn = document.getElementById('leaveGroupBtn');
            if (leaveGroupBtn) leaveGroupBtn.style.display = 'none';
            const memberCount = document.getElementById('memberCount');
            if (memberCount) memberCount.style.display = 'none';
            updateMuteBanUI();
        } else {
            const isChatChung = id === 'chat_chung';
            chatSub.textContent = isChatChung ? '🌐 ' + t('chat.group_chat') : `👥 ${t('chat.group_chat')}: ${name}`;
            const chatAvatarText = document.getElementById('chatAvatarText');
            if (chatAvatarText) {
                chatAvatarText.textContent = isChatChung ? '💬' : (groupData?.avatar || '👥');
                chatAvatarText.style.display = 'flex';
            }
            const chatAvatarImage = document.getElementById('chatAvatarImage');
            if (chatAvatarImage) chatAvatarImage.style.display = 'none';
            const chatAvatarFrame = document.getElementById('chatAvatarFrame');
            if (chatAvatarFrame) chatAvatarFrame.style.display = 'none';
            
            const addMemberBtn = document.getElementById('addMemberBtn');
            const viewMembersBtn = document.getElementById('viewMembersBtn');
            const leaveGroupBtn = document.getElementById('leaveGroupBtn');
            const memberCount = document.getElementById('memberCount');
            
            if (!isChatChung) {
                if (addMemberBtn) addMemberBtn.style.display = 'block';
                if (viewMembersBtn) viewMembersBtn.style.display = 'block';
                if (leaveGroupBtn) leaveGroupBtn.style.display = 'block';
                if (memberCount) memberCount.style.display = 'inline';
                try {
                    const membersData = await API.getGroupMembers(id);
                    currentGroupMembers = membersData.members || [];
                    const mutedUsers = membersData.muted || [];
                    const bannedUsers = membersData.banned || [];
                    isUserMuted = mutedUsers.includes(currentUser.username);
                    isUserBanned = bannedUsers.includes(currentUser.username);
                    const groups = await API.getGroups(currentUser.username);
                    const groupInfo = groups.find(g => g.id === id);
                    currentGroupOwner = groupInfo?.createdBy || '';
                    if (memberCount) memberCount.textContent = currentGroupMembers.length + ' ' + t('chat.members');
                    updateMuteBanUI();
                } catch (e) {
                    console.error('Load members error:', e);
                }
            } else {
                if (addMemberBtn) addMemberBtn.style.display = 'none';
                if (viewMembersBtn) viewMembersBtn.style.display = 'none';
                if (leaveGroupBtn) leaveGroupBtn.style.display = 'none';
                if (memberCount) memberCount.style.display = 'none';
                currentGroupOwner = '';
                isUserMuted = false;
                isUserBanned = false;
                updateMuteBanUI();
            }
        }
    }

    if (unreadCounts[chatId]) {
        delete unreadCounts[chatId];
        renderSidebar();
    }

    socket.emit('join-room', chatId);

    try {
        const messages = await API.getMessages(chatId);
        renderMessages(messages);
    } catch (e) {
        console.error('Load messages error:', e);
    }
    renderSidebar();
    updateCharLimitUI();
    if (msgInput && !isUserMuted && !isUserBanned) msgInput.focus();
}

async function sendMessage() {
    const text = msgInput ? msgInput.value.trim() : '';
    if (!text && !pendingImage) {
        showToast('info', t('toast.need_message'));
        return;
    }
    if (!currentChat) {
        showToast('info', t('toast.select_chat'));
        return;
    }
    if (!socketConnected) {
        showToast('error', t('toast.no_connection'));
        return;
    }

    if (currentChat.type === 'group' && currentChat.id !== 'chat_chung') {
        if (isUserMuted) {
            showToast('warning', t('chat.muted'));
            return;
        }
        if (isUserBanned) {
            showToast('error', t('chat.banned'));
            return;
        }
    }

    const effectToSend = (currentEffect !== 'none' && currentUser?.effects?.includes(currentEffect)) ? currentEffect : 'none';

    const frameToSend = currentUser?.currentFrame || 'default';
    const avatarFrameToSend = currentUser?.currentAvatarFrame || 'default';
    const gradientToSend = currentUser?.gradientText || false;
    const typingToSend = currentUser?.typingEffect || false;
    const highlightToSend = currentUser?.highlightedName || false;

    const mentions = [];
    if (text) {
        const mentionRegex = /@(\w+)/g;
        let match;
        while ((match = mentionRegex.exec(text)) !== null) {
            if (!mentions.includes(match[1])) mentions.push(match[1]);
        }
    }

    const chatId = getChatId(currentChat.type, currentChat.id);
    const msgData = {
        chatId: chatId,
        from: currentUser.username,
        message: text || '',
        image: pendingImage || '',
        time: new Date().toISOString(),
        effect: effectToSend,
        mentions: mentions,
        frame: frameToSend,
        avatarFrame: avatarFrameToSend,
        gradient: gradientToSend,
        typing: typingToSend,
        highlight: highlightToSend
    };

    socket.emit('chat-message', msgData);
    
    renderMessage({ 
        from: currentUser.username, 
        text: text || '', 
        image: pendingImage || '', 
        time: new Date().toISOString(), 
        effect: effectToSend,
        mentions: mentions,
        frame: frameToSend,
        avatarFrame: avatarFrameToSend,
        gradient: gradientToSend,
        typing: typingToSend,
        highlight: highlightToSend
    }, chatId);
    
    try {
        await API.updateMission(currentUser.username, 'message');
    } catch (e) {
        console.log('Update mission error:', e);
    }
    
    if (msgInput) msgInput.value = '';
    pendingImage = null;
    const imageBtn = document.querySelector('.image-btn');
    if (imageBtn) imageBtn.classList.remove('active-feature');
    const imageToolbarBtn = document.getElementById('imageToolbarBtn');
    if (imageToolbarBtn) imageToolbarBtn.classList.remove('active-feature');
    updateCharLimitUI();
    if (msgInput && !isUserMuted && !isUserBanned) msgInput.focus();
}

// ============================================================
// FRIEND FUNCTIONS
// ============================================================
async function acceptFriend(from) {
    const result = await API.acceptFriendRequest(from, currentUser.username);
    if (result.success) {
        await loadFriends();
        renderSidebar();
        try {
            await API.updateMission(currentUser.username, 'friend');
        } catch (e) {}
    }
}

async function rejectFriend(from) {
    requestsCache = requestsCache.filter(r => !(r.from === from && r.to === currentUser.username));
    renderSidebar();
}

async function removeFriend(friend) {
    if (!confirm(`Xóa bạn bè ${friend}?`)) return;
    const result = await API.removeFriend(currentUser.username, friend);
    if (result.success) { await loadFriends(); renderSidebar(); }
}

// ============================================================
// GROUP FUNCTIONS
// ============================================================
async function refreshGroupMembers() {
    if (!currentChat || currentChat.type !== 'group' || currentChat.id === 'chat_chung') return;
    try {
        const membersData = await API.getGroupMembers(currentChat.id);
        currentGroupMembers = membersData.members || [];
        const mutedUsers = membersData.muted || [];
        const bannedUsers = membersData.banned || [];
        isUserMuted = mutedUsers.includes(currentUser.username);
        isUserBanned = bannedUsers.includes(currentUser.username);
        const memberCount = document.getElementById('memberCount');
        if (memberCount) memberCount.textContent = currentGroupMembers.length + ' ' + t('chat.members');
        updateMuteBanUI();
    } catch (e) {
        console.error('Refresh members error:', e);
    }
}

async function viewMembers() {
    if (!currentChat || currentChat.type !== 'group' || currentChat.id === 'chat_chung') {
        showToast('info', 'Không thể xem thành viên trong Chat Chung');
        return;
    }
    
    const container = document.getElementById('memberListContainer');
    if (!container) return;
    container.innerHTML = '';
    
    try {
        const membersData = await API.getGroupMembers(currentChat.id);
        const members = membersData.members || [];
        const mutedUsers = membersData.muted || [];
        const bannedUsers = membersData.banned || [];
        currentGroupMembers = members;
        
        if (members.length === 0) {
            container.innerHTML = '<div style="color:rgba(255,255,255,0.3);padding:20px;text-align:center;">Không có thành viên</div>';
            openModal('memberListModal');
            return;
        }
        
        members.forEach(member => {
            const div = document.createElement('div');
            div.className = 'member-item';
            const userData = allUsersMap[member.userId] || {};
            const isOwner = member.userId === currentGroupOwner;
            const isCurrentUser = member.userId === currentUser.username;
            const isMuted = mutedUsers.includes(member.userId);
            const isBanned = bannedUsers.includes(member.userId);
            const canAct = currentUser.username === currentGroupOwner && !isOwner && !isCurrentUser;
            
            let statusHtml = '';
            if (isOwner) statusHtml += `<span class="role-tag">${t('group.owner')}</span>`;
            else if (isCurrentUser) statusHtml += `<span class="role-tag" style="background:rgba(46,204,113,0.2);color:#2ecc71;">${t('group.member')}</span>`;
            if (isMuted) statusHtml += `<span class="member-status muted">🔇 ${t('group.muted')}</span>`;
            if (isBanned) statusHtml += `<span class="member-status banned">🚫 ${t('group.banned')}</span>`;
            
            let actionsHtml = '';
            if (canAct) {
                actionsHtml = `
                    <button class="kick-btn" onclick="kickMember('${member.userId}')">${t('group.kick')}</button>
                    <button class="mute-btn ${isMuted ? 'muted' : ''}" onclick="muteMember('${member.userId}')">${isMuted ? t('group.unmute') : t('group.mute')}</button>
                    <button class="ban-btn ${isBanned ? 'banned' : ''}" onclick="banMember('${member.userId}')">${isBanned ? t('group.unban') : t('group.ban')}</button>
                `;
            } else if (isCurrentUser && currentChat.id !== 'chat_chung') {
                actionsHtml = `<button class="kick-btn" onclick="leaveGroupAction()" style="background:rgba(231,76,60,0.15);color:#e74c3c;">${t('chat.leave_group')}</button>`;
            }
            
            div.innerHTML = `
                <div>
                    <span class="name">${userData.displayName || member.userId}</span>
                    ${statusHtml}
                </div>
                <div class="actions">${actionsHtml}</div>
            `;
            container.appendChild(div);
        });
        
        openModal('memberListModal');
    } catch (e) {
        console.error('View members error:', e);
        showToast('error', 'Lỗi tải danh sách thành viên');
    }
}

async function kickMember(username) {
    if (!currentChat || currentChat.type !== 'group' || currentChat.id === 'chat_chung') {
        showToast('info', 'Không thể kick trong Chat Chung');
        return;
    }
    if (username === currentGroupOwner) {
        showToast('error', 'Không thể kick chủ nhóm');
        return;
    }
    if (!confirm(`Kick ${allUsersMap[username]?.displayName || username} khỏi nhóm?`)) return;
    
    try {
        socket.emit('group-action', {
            groupId: currentChat.id,
            action: 'kick',
            targetUser: username,
            byUser: currentUser.username
        });
        await API.removeMemberFromGroup(currentChat.id, username);
        showToast('success', `Đã kick ${allUsersMap[username]?.displayName || username} khỏi nhóm!`);
        await refreshGroupMembers();
        closeModal('memberListModal');
        viewMembers();
    } catch (e) {
        console.error('Kick member error:', e);
        showToast('error', 'Lỗi kick thành viên');
    }
}

async function muteMember(username) {
    if (!currentChat || currentChat.type !== 'group' || currentChat.id === 'chat_chung') {
        showToast('info', 'Không thể mute trong Chat Chung');
        return;
    }
    if (username === currentGroupOwner) {
        showToast('error', 'Không thể mute chủ nhóm');
        return;
    }
    
    const membersData = await API.getGroupMembers(currentChat.id);
    const mutedUsers = membersData.muted || [];
    const isMuted = mutedUsers.includes(username);
    const action = isMuted ? 'unmute' : 'mute';
    
    if (!confirm(`${isMuted ? 'Bỏ mute' : 'Mute'} ${allUsersMap[username]?.displayName || username}?`)) return;
    
    try {
        socket.emit('group-action', {
            groupId: currentChat.id,
            action: action,
            targetUser: username,
            byUser: currentUser.username
        });
        if (isMuted) {
            await API.unmuteMember(currentChat.id, username);
            showToast('success', `Đã bỏ mute ${allUsersMap[username]?.displayName || username}`);
        } else {
            await API.muteMember(currentChat.id, username);
            showToast('success', `Đã mute ${allUsersMap[username]?.displayName || username}`);
        }
        await refreshGroupMembers();
        closeModal('memberListModal');
        viewMembers();
    } catch (e) {
        console.error('Mute error:', e);
        showToast('error', `Lỗi ${isMuted ? 'unmute' : 'mute'} thành viên`);
    }
}

async function banMember(username) {
    if (!currentChat || currentChat.type !== 'group' || currentChat.id === 'chat_chung') {
        showToast('info', 'Không thể ban trong Chat Chung');
        return;
    }
    if (username === currentGroupOwner) {
        showToast('error', 'Không thể ban chủ nhóm');
        return;
    }
    
    const membersData = await API.getGroupMembers(currentChat.id);
    const bannedUsers = membersData.banned || [];
    const isBanned = bannedUsers.includes(username);
    const action = isBanned ? 'unban' : 'ban';
    
    if (!confirm(`${isBanned ? 'Bỏ ban' : 'Ban'} ${allUsersMap[username]?.displayName || username}?`)) return;
    
    try {
        socket.emit('group-action', {
            groupId: currentChat.id,
            action: action,
            targetUser: username,
            byUser: currentUser.username
        });
        if (isBanned) {
            await API.unbanMember(currentChat.id, username);
            showToast('success', `Đã bỏ ban ${allUsersMap[username]?.displayName || username}`);
        } else {
            await API.banMember(currentChat.id, username);
            await API.removeMemberFromGroup(currentChat.id, username);
            showToast('success', `Đã ban ${allUsersMap[username]?.displayName || username} khỏi nhóm!`);
        }
        await refreshGroupMembers();
        closeModal('memberListModal');
        viewMembers();
        await loadGroups();
        renderSidebar();
    } catch (e) {
        console.error('Ban error:', e);
        showToast('error', `Lỗi ${isBanned ? 'unban' : 'ban'} thành viên`);
    }
}

async function leaveGroupAction() {
    if (!currentChat || currentChat.type !== 'group' || currentChat.id === 'chat_chung') {
        showToast('info', t('toast.cannot_leave_chat_chung'));
        return;
    }
    if (!confirm(`Rời nhóm "${currentChat.name}"?`)) return;
    const result = await API.removeMemberFromGroup(currentChat.id, currentUser.username);
    if (result.success) {
        showToast('success', t('toast.left_group'));
        closeModal('memberListModal');
        await loadGroups();
        renderSidebar();
        const chatChung = groupsCache.find(g => g.id === 'chat_chung');
        if (chatChung) openChat('group', 'chat_chung', '💬 Chat Chung', null, chatChung);
    } else {
        showToast('error', t('toast.leave_error'));
    }
}

// ============================================================
// FRAME FUNCTIONS
// ============================================================
function openFrameSelector() {
    const list = document.getElementById('frameList');
    if (!list) return;
    list.innerHTML = '';
    
    const userFrames = currentUser?.frames || ['default'];
    const currentFrame = currentUser?.currentFrame || 'default';
    const isVIP = vipData.isActive;
    
    ALL_FRAMES.forEach(frame => {
        const owned = userFrames.includes(frame.key);
        const isActive = frame.key === currentFrame;
        const div = document.createElement('div');
        div.className = `frame-item ${isActive ? 'active' : ''}`;
        const frameClass = frame.key !== 'default' ? frame.key : 'default';
        
        if (frame.vip && !isVIP && !owned) {
            div.style.opacity = '0.5';
            div.style.cursor = 'not-allowed';
        }
        
        let statusText = '', statusClass = '';
        if (isActive) { 
            statusText = '✅ ' + t('frame.using'); 
            statusClass = 'using'; 
        } else if (owned) { 
            statusText = t('frame.owned'); 
            statusClass = 'owned'; 
        } else if (frame.vip && !isVIP) { 
            statusText = '👑 ' + t('frame.locked'); 
            statusClass = 'locked'; 
        } else { 
            statusText = '🔒 ' + t('frame.locked'); 
            statusClass = 'locked'; 
        }
        
        div.innerHTML = `
            <div class="frame-preview ${frameClass}">${frame.key !== 'default' ? '📝' : '📄'}</div>
            <div class="frame-name">${t(frame.label)} ${frame.vip ? '👑' : ''}</div>
            <div class="frame-status ${statusClass}">${statusText}</div>
            ${owned || frame.key === 'default' ? `
                <div class="frame-actions">
                    ${isActive ? 
                        `<button class="use-btn using" disabled>${t('frame.using_text')}</button>` :
                        `<button class="use-btn" onclick="useFrame('${frame.key}')">${t('frame.use')}</button>`
                    }
                    ${frame.key !== 'default' ? 
                        `<button class="remove-btn" onclick="removeFrame('${frame.key}')">${t('frame.remove')}</button>` : 
                        `<button class="remove-btn" disabled style="opacity:0.3;cursor:not-allowed;">${t('frame.remove')}</button>`
                    }
                </div>
            ` : (frame.vip && !isVIP ? 
                `<div style="margin-top:8px;font-size:0.6rem;color:#ffd700;">👑 Yêu cầu VIP</div>` : 
                '')}
        `;
        list.appendChild(div);
    });
    openModal('frameModal');
}

async function useFrame(frameKey) {
    const result = await API.updateUser(currentUser.username, { currentFrame: frameKey });
    if (result && result.success) {
        currentUser.currentFrame = frameKey;
        updateUserUI(currentUser);
        if (currentChat) {
            const chatId = getChatId(currentChat.type, currentChat.id);
            const messages = await API.getMessages(chatId);
            renderMessages(messages);
        }
        closeModal('frameModal');
        const frameInfo = ALL_FRAMES.find(f => f.key === frameKey);
        showToast('success', t('toast.frame_selected', { name: t(frameInfo.label) }));
    } else {
        showToast('error', 'Lỗi chọn frame');
    }
}

async function removeFrame(frameKey) {
    if (frameKey === 'default') {
        showToast('error', 'Không thể gỡ frame mặc định');
        return;
    }
    if (!confirm(`Gỡ frame ${t(`frame.${frameKey}`)}?`)) return;
    
    const result = await API.updateUser(currentUser.username, { currentFrame: 'default' });
    if (result && result.success) {
        currentUser.currentFrame = 'default';
        updateUserUI(currentUser);
        if (currentChat) {
            const chatId = getChatId(currentChat.type, currentChat.id);
            const messages = await API.getMessages(chatId);
            renderMessages(messages);
        }
        closeModal('frameModal');
        openFrameSelector();
        showToast('success', t('toast.frame_removed'));
    } else {
        showToast('error', 'Lỗi gỡ frame');
    }
}

// ============================================================
// AVATAR FRAME FUNCTIONS
// ============================================================
function openAvatarFrameSelector() {
    const list = document.getElementById('avatarFrameList');
    if (!list) return;
    list.innerHTML = '';
    
    const userFrames = currentUser?.avatarFrames || ['default'];
    const currentFrame = currentUser?.currentAvatarFrame || 'default';
    const isVIP = vipData.isActive;
    
    ALL_AVATAR_FRAMES.forEach(frame => {
        const owned = userFrames.includes(frame.key);
        const isActive = frame.key === currentFrame;
        const div = document.createElement('div');
        div.className = `frame-item ${isActive ? 'active' : ''}`;
        
        if (frame.vip && !isVIP && !owned) {
            div.style.opacity = '0.5';
            div.style.cursor = 'not-allowed';
        }
        
        const frameClass = frame.key !== 'default' ? frame.className : 'default';
        let statusText = '', statusClass = '';
        if (isActive) { 
            statusText = '✅ ' + t('avatarframe.using'); 
            statusClass = 'using'; 
        } else if (owned) { 
            statusText = t('avatarframe.owned'); 
            statusClass = 'owned'; 
        } else if (frame.vip && !isVIP) { 
            statusText = '👑 ' + t('avatarframe.locked'); 
            statusClass = 'locked'; 
        } else { 
            statusText = '🔒 ' + t('avatarframe.locked'); 
            statusClass = 'locked'; 
        }
        
        let borderColor = 'rgba(255,255,255,0.1)';
        if (frame.key === 'avtframe1') borderColor = '#ffd700';
        else if (frame.key === 'avtframe2') borderColor = '#c0c0c0';
        else if (frame.key === 'avtframe3') borderColor = '#00d4ff';
        else if (frame.key === 'avtframe4') borderColor = '#ff6b6b';
        else if (frame.key === 'avtframe5') borderColor = '#6c5ce7';
        else if (frame.key === 'avtframe6') borderColor = '#f7971e';
        
        const animClass = frame.key !== 'default' ? frame.key.replace('avtframe', '') : '';
        const animName = animClass === '1' ? 'goldPulse' : 
                        animClass === '2' ? 'platinumPulse' : 
                        animClass === '3' ? 'diamondPulse' : 
                        animClass === '4' ? 'rainbowPulse' : 
                        animClass === '5' ? 'cosmicPulse' : 
                        animClass === '6' ? 'infernoPulse' : '';
        
        div.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;padding:8px 0;">
                <div style="position:relative;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#2d2d4a,#1a1a2e);display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin-bottom:8px;">
                    <span>${frame.icon}</span>
                    <div style="position:absolute;inset:-4px;border-radius:50%;border:3px solid ${borderColor};transition:all 0.3s ease;${frame.key !== 'default' ? `box-shadow:0 0 20px ${borderColor}40;animation:${animName} 1.5s ease-in-out infinite;` : ''}"></div>
                </div>
                <div class="frame-name">${t(frame.label)} ${frame.vip ? '👑' : ''}</div>
                <div class="frame-status ${statusClass}">${statusText}</div>
                ${owned || frame.key === 'default' ? `
                    <div class="frame-actions">
                        ${isActive ? 
                            `<button class="use-btn using" disabled>${t('avatarframe.using_text')}</button>` :
                            `<button class="use-btn" onclick="useAvatarFrame('${frame.key}')">${t('avatarframe.use')}</button>`
                        }
                        ${frame.key !== 'default' ? 
                            `<button class="remove-btn" onclick="removeAvatarFrame('${frame.key}')">${t('avatarframe.remove')}</button>` : 
                            `<button class="remove-btn" disabled style="opacity:0.3;cursor:not-allowed;">${t('avatarframe.remove')}</button>`
                        }
                    </div>
                ` : (frame.vip && !isVIP ? 
                    `<div style="margin-top:8px;font-size:0.6rem;color:#ffd700;">👑 Yêu cầu VIP</div>` : 
                    '')}
            </div>
        `;
        list.appendChild(div);
    });
    openModal('avatarFrameModal');
}

async function useAvatarFrame(frameKey) {
    const result = await API.updateUser(currentUser.username, { currentAvatarFrame: frameKey });
    if (result && result.success) {
        currentUser.currentAvatarFrame = frameKey;
        updateUserUI(currentUser);
        updateAvatarFrameUI(frameKey);
        closeModal('avatarFrameModal');
        const frameInfo = ALL_AVATAR_FRAMES.find(f => f.key === frameKey);
        showToast('success', t('toast.avatarframe_selected', { name: t(frameInfo.label) }));
        socket.emit('user-updated', {
            username: currentUser.username,
            type: 'avatarframe',
            fullUser: currentUser
        });
    } else {
        showToast('error', 'Lỗi chọn khung avatar');
    }
}

async function removeAvatarFrame(frameKey) {
    if (frameKey === 'default') {
        showToast('error', 'Không thể gỡ khung mặc định');
        return;
    }
    if (!confirm(`Gỡ khung avatar ${t(`avatarframe.${frameKey}`)}?`)) return;
    
    const result = await API.updateUser(currentUser.username, { currentAvatarFrame: 'default' });
    if (result && result.success) {
        currentUser.currentAvatarFrame = 'default';
        updateUserUI(currentUser);
        updateAvatarFrameUI('default');
        closeModal('avatarFrameModal');
        openAvatarFrameSelector();
        showToast('success', t('toast.avatarframe_removed'));
        socket.emit('user-updated', {
            username: currentUser.username,
            type: 'avatarframe',
            fullUser: currentUser
        });
    } else {
        showToast('error', 'Lỗi gỡ khung avatar');
    }
}

function updateAvatarFrameUI(frameKey) {
    const frameClass = getAvatarFrameClass(frameKey);
    const avatarFrameDisplay = document.getElementById('avatarFrameDisplay');
    if (avatarFrameDisplay) avatarFrameDisplay.className = 'avatar-frame ' + frameClass;
}

// ============================================================
// LOAD DATA
// ============================================================
async function loadFriends() {
    friendsCache = await API.getFriends(currentUser.username);
    requestsCache = await API.getFriendRequests(currentUser.username);
}

async function loadGroups() {
    const groups = await API.getGroups(currentUser.username);
    const hasChatChung = groups.some(g => g.id === 'chat_chung');
    if (!hasChatChung) {
        groups.push({
            id: 'chat_chung',
            name: '💬 Chat Chung',
            avatar: '💬',
            isPermanent: true,
            memberCount: 0
        });
    }
    for (const group of groups) {
        try {
            if (group.id !== 'chat_chung') {
                const membersData = await API.getGroupMembers(group.id);
                group.memberCount = (membersData.members || []).length;
            } else {
                const users = await API.getUsers();
                group.memberCount = users.length;
            }
        } catch (e) {}
    }
    groupsCache = groups;
}

async function loadAllUsers() {
    try {
        const users = await API.getUsers();
        allUsersList = users;
        allUsersMap = {};
        users.forEach(u => { allUsersMap[u.username] = u; });
    } catch (e) { console.error('Load users error:', e); }
}

async function loadAchievements() {
    try {
        const result = await API.getAchievements(currentUser.username);
        if (result && result.success) {
            // achievements được lưu trong state
            updateAchievementUI();
        }
    } catch (e) {
        console.error('Load achievements error:', e);
    }
}

function updateUserUI(user) {
    if (!user) return;
    const sidebarName = document.getElementById('sidebarName');
    if (sidebarName) sidebarName.textContent = user.displayName || user.username;
    
    const role = getRoleDisplay(user);
    const sidebarTier = document.getElementById('sidebarTier');
    if (sidebarTier) {
        sidebarTier.textContent = role.label;
        sidebarTier.className = 'role-badge ' + role.className;
    }

    if (user.highlightedName) {
        const nameEl = document.querySelector('.sidebar .user-info .info .name span:first-child');
        if (nameEl) nameEl.classList.add('highlighted');
    }

    const avatarImage = document.getElementById('avatarImage');
    const avatarText = document.getElementById('avatarText');
    if (user.avatarUrl) {
        if (avatarImage) {
            avatarImage.src = user.avatarUrl;
            avatarImage.style.display = 'block';
        }
        if (avatarText) avatarText.style.display = 'none';
    } else {
        if (avatarText) {
            avatarText.textContent = (user.displayName || user.username)[0].toUpperCase();
            avatarText.style.display = 'flex';
        }
        if (avatarImage) avatarImage.style.display = 'none';
    }

    const frameKey = user.currentAvatarFrame || 'default';
    updateAvatarFrameUI(frameKey);

    renderBadges();
    const sidebarBadgeDisplay = document.getElementById('sidebarBadgeDisplay');
    if (sidebarBadgeDisplay) {
        if (user.currentBadge) {
            sidebarBadgeDisplay.textContent = '🏅 ' + user.currentBadge;
            sidebarBadgeDisplay.style.display = 'inline';
        } else {
            sidebarBadgeDisplay.style.display = 'none';
        }
    }

    const userCash = document.getElementById('userCash');
    if (userCash) {
        userCash.textContent = (user.cash || 0).toLocaleString();
    }

    const msgColorPicker = document.getElementById('msgColorPicker');
    if (msgColorPicker && user.msgColor) msgColorPicker.value = user.msgColor;

    const adminManageBtn = document.getElementById('adminManageBtn');
    if (adminManageBtn) {
        const allowedRoles = ['support', 'manager', 'admin', 'owner'];
        if (allowedRoles.includes(user.role)) adminManageBtn.classList.remove('hidden');
        else adminManageBtn.classList.add('hidden');
    }

    if (user.gradientText) {
        isGradientEnabled = true;
        const gradientBtn = document.getElementById('gradientBtn');
        if (gradientBtn) {
            gradientBtn.classList.add('active-feature');
            gradientBtn.innerHTML = `<i class="fas fa-fill-drip"></i> ${t('chat.gradient')} ON`;
        }
    }
    if (user.typingEffect) {
        isTypingEnabled = true;
        const typingBtn = document.getElementById('typingBtn');
        if (typingBtn) {
            typingBtn.classList.add('active-feature');
            typingBtn.innerHTML = `<i class="fas fa-keyboard"></i> ${t('chat.typing')} ON`;
        }
    }
    if (user.highlightedName) {
        isHighlightEnabled = true;
        const highlightBtn = document.getElementById('highlightBtn');
        if (highlightBtn) {
            highlightBtn.classList.add('active-feature');
            highlightBtn.innerHTML = `<i class="fas fa-star"></i> ${t('chat.highlight')} ON`;
        }
    }
    
    updateCharLimitUI();
    updateNotificationBadge();
    renderEffectExpiry();
    updateVIPUI();
    updateAchievementUI();
}

function renderBadges() {
    const container = document.getElementById('badgesContainer');
    if (!container) return;
    container.innerHTML = '';
    (currentUser.badges || []).forEach(badge => {
        const span = document.createElement('span');
        span.className = `badge-item ${badge === currentUser.currentBadge ? 'active-badge' : ''}`;
        span.textContent = badge;
        container.appendChild(span);
    });
}

function updateAchievementUI() {
    const badges = currentUser?.badges || [];
    const totalAchievements = ACHIEVEMENTS_LIST.length;
    const unlockedCount = badges.filter(b => ACHIEVEMENTS_LIST.some(a => a.name === b)).length;
    
    const achCount = document.getElementById('achCount');
    const achTotal = document.getElementById('achTotal');
    const achBadge = document.getElementById('achBadge');
    
    if (achCount) achCount.textContent = unlockedCount;
    if (achTotal) achTotal.textContent = totalAchievements;
    if (achBadge) {
        if (unlockedCount >= totalAchievements) {
            achBadge.textContent = '🏆';
        } else if (unlockedCount >= totalAchievements * 0.7) {
            achBadge.textContent = '⭐';
        } else if (unlockedCount >= totalAchievements * 0.4) {
            achBadge.textContent = '🌟';
        } else {
            achBadge.textContent = '🎯';
        }
    }
}

// ============================================================
// ACHIEVEMENTS FUNCTIONS
// ============================================================
async function openAchievements() {
    const list = document.getElementById('achievementList');
    if (!list) return;
    list.innerHTML = '';
    
    await loadAchievements();
    
    const badges = currentUser.badges || [];
    const currentBadge = currentUser.currentBadge;
    
    ACHIEVEMENTS_LIST.forEach(ach => {
        const unlocked = badges.includes(ach.name);
        const isActive = ach.name === currentBadge;
        
        const div = document.createElement('div');
        div.className = `achievement-item-wrapper ${unlocked ? 'unlocked' : ''}`;
        
        div.innerHTML = `
            <div class="ach-left">
                <span class="ach-icon">${ach.icon}</span>
                <div class="ach-info">
                    <div class="ach-name">${ach.name}</div>
                    <div class="ach-desc">${ach.desc}</div>
                </div>
            </div>
            <div class="ach-right">
                <span class="ach-status ${unlocked ? 'unlocked' : 'locked'}">
                    ${unlocked ? '✅ ' + t('ach.unlocked') : '🔒 ' + t('ach.locked')}
                </span>
                ${unlocked ? (isActive ? 
                    `<button class="ach-btn remove-btn" onclick="removeBadge('${ach.name}')">${t('ach.remove')}</button>` : 
                    `<button class="ach-btn use-btn" onclick="useBadge('${ach.name}')">${t('ach.use')}</button>`
                ) : 
                    `<button class="ach-btn locked-btn" disabled>🔒</button>`
                }
            </div>
        `;
        list.appendChild(div);
    });
    
    openModal('achievementModal');
}

async function useBadge(badge) {
    const result = await API.setBadge(currentUser.username, badge);
    if (result.success) {
        currentUser.currentBadge = badge;
        const sidebarBadgeDisplay = document.getElementById('sidebarBadgeDisplay');
        if (sidebarBadgeDisplay) {
            sidebarBadgeDisplay.textContent = '🏅 ' + badge;
            sidebarBadgeDisplay.style.display = 'inline';
        }
        renderBadges();
        updateAchievementUI();
        closeModal('achievementModal');
        showToast('success', t('toast.badge_used') + badge);
    }
}

async function removeBadge(badge) {
    const result = await API.setBadge(currentUser.username, null);
    if (result.success) {
        currentUser.currentBadge = null;
        const sidebarBadgeDisplay = document.getElementById('sidebarBadgeDisplay');
        if (sidebarBadgeDisplay) sidebarBadgeDisplay.style.display = 'none';
        renderBadges();
        updateAchievementUI();
        closeModal('achievementModal');
        showToast('success', t('toast.badge_removed'));
    }
}

// ============================================================
// THEME
// ============================================================
function applyTheme(themeKey) {
    const themeImage = document.getElementById('themeImage');
    const themeBackground = document.getElementById('themeBackground');
    if (themeKey === 'default') {
        if (themeImage) themeImage.style.display = 'none';
        if (themeBackground) themeBackground.style.background = '#0d0d1a';
    } else {
        const themeFile = ALL_THEMES.find(t => t.key === themeKey)?.file;
        if (themeFile && themeImage) {
            themeImage.src = '/' + themeFile;
            themeImage.style.display = 'block';
            themeImage.onerror = function() {
                themeImage.style.display = 'none';
                if (themeBackground) themeBackground.style.background = '#0d0d1a';
            };
        }
    }
}

// ============================================================
// SEASON PASS FUNCTIONS
// ============================================================
function renderSeasonPass() {
    const rewardsContainer = document.getElementById('seasonRewardsList');
    if (!rewardsContainer) return;
    
    rewardsContainer.innerHTML = '';
    
    const tier = seasonData.tier || 0;
    const maxExp = seasonData.maxExp || 100;
    const exp = seasonData.exp || 0;
    const isElite = seasonData.isElite || false;
    const claimedRewards = seasonData.claimedRewards || [];
    const claimedElite = seasonData.claimedElite || [];
    
    document.getElementById('seasonLevelDisplay').innerHTML = `${tier} <span>/ 50</span>`;
    document.getElementById('seasonProgressLevel').textContent = tier;
    document.getElementById('seasonCurrentExp').textContent = exp;
    document.getElementById('seasonMaxExp').textContent = maxExp;
    const progress = Math.min((exp / maxExp) * 100, 100);
    document.getElementById('seasonProgressFill').style.width = progress + '%';
    
    const freeBtn = document.getElementById('seasonFreeBtn');
    const eliteBtn = document.getElementById('seasonEliteBtn');
    const upgradeBtn = document.getElementById('seasonUpgradeBtn');
    const buyEliteBtn = document.getElementById('seasonBuyEliteBtn');
    
    if (isElite) {
        eliteBtn.classList.add('active');
        freeBtn.classList.remove('active');
        upgradeBtn.disabled = true;
        upgradeBtn.innerHTML = '<i class="fas fa-check"></i> ELITE';
        buyEliteBtn.disabled = true;
        buyEliteBtn.innerHTML = '<i class="fas fa-check"></i> ĐÃ MUA';
    } else {
        freeBtn.classList.add('active');
        eliteBtn.classList.remove('active');
        upgradeBtn.disabled = false;
        upgradeBtn.innerHTML = '<i class="fas fa-arrow-up"></i> UPGRADE';
        buyEliteBtn.disabled = false;
        buyEliteBtn.style.display = 'inline-block';
        buyEliteBtn.innerHTML = '<i class="fas fa-crown"></i> MUA ELITE (400k 💵)';
    }
    
    SEASON_REWARDS.forEach(reward => {
        const isUnlocked = reward.level <= tier;
        const isClaimed = claimedRewards.includes(reward.level);
        const isEliteClaimed = claimedElite.includes(reward.level);
        const hasElite = isElite && reward.elite;
        const isEliteUnlocked = hasElite && isUnlocked;
        
        const div = document.createElement('div');
        div.className = `reward-item ${isUnlocked ? 'unlocked' : 'locked'} ${isClaimed ? 'claimed' : ''}`;
        
        let expiryInfo = '';
        if (reward.free && reward.free.type === 'effect') {
            const daysLeft = getEffectDaysLeft(reward.free.key);
            if (daysLeft !== null && daysLeft > 0) {
                expiryInfo = `<div style="font-size:0.5rem;color:#2ecc71;">⏳ ${daysLeft} ngày</div>`;
            } else if (daysLeft !== null && daysLeft <= 0) {
                expiryInfo = `<div style="font-size:0.5rem;color:#e74c3c;">❌ Hết hạn</div>`;
            }
        }
        if (reward.elite && reward.elite.type === 'effect') {
            const daysLeft = getEffectDaysLeft(reward.elite.key);
            if (daysLeft !== null && daysLeft > 0) {
                expiryInfo = `<div style="font-size:0.5rem;color:#2ecc71;">⏳ ${daysLeft} ngày</div>`;
            } else if (daysLeft !== null && daysLeft <= 0) {
                expiryInfo = `<div style="font-size:0.5rem;color:#e74c3c;">❌ Hết hạn</div>`;
            }
        }
        
        let statusHtml = '';
        if (isClaimed) {
            statusHtml = `<span class="reward-status claimed-status">✅ ${t('status.claimed')}</span>`;
        } else if (isUnlocked) {
            statusHtml = `<span class="reward-status unlocked-status">🎁 ${t('status.ready')}</span>`;
        } else {
            statusHtml = `<span class="reward-status locked-status">🔒 ${t('status.locked')}</span>`;
        }
        
        let claimBtnHtml = '';
        if (isUnlocked && !isClaimed) {
            claimBtnHtml = `<button class="claim-btn" onclick="claimSeasonReward(${reward.level}, false)">${t('btn.free')}</button>`;
        } else if (isClaimed) {
            claimBtnHtml = `<button class="claim-btn claimed-btn" disabled>✅</button>`;
        }
        
        let eliteClaimBtnHtml = '';
        if (hasElite && isEliteUnlocked && !isEliteClaimed && isElite) {
            eliteClaimBtnHtml = `<button class="claim-btn" onclick="claimSeasonReward(${reward.level}, true)" style="background:#f7971e;">👑</button>`;
        } else if (hasElite && isEliteUnlocked && isEliteClaimed) {
            eliteClaimBtnHtml = `<button class="claim-btn claimed-btn" disabled>✅</button>`;
        }
        
        const freeIcon = reward.free ? reward.free.icon : '🎁';
        const freeName = reward.free ? reward.free.name : 'Reward';
        
        div.innerHTML = `
            <span class="reward-level">Lv${reward.level}</span>
            <span class="reward-icon">${freeIcon}</span>
            <span class="reward-name">${freeName}</span>
            ${expiryInfo}
            ${hasElite ? `<span style="font-size:0.5rem;color:#f7971e;">👑 ${reward.elite.name}</span>` : ''}
            <div style="margin-top:2px;">${statusHtml}</div>
            <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;margin-top:4px;">
                ${claimBtnHtml}
                ${eliteClaimBtnHtml}
            </div>
        `;
        rewardsContainer.appendChild(div);
    });
}

function renderMissions() {
    const container = document.getElementById('seasonMissionsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    const missions = seasonData.missions || {};
    const lastReset = new Date(seasonData.lastReset || Date.now());
    const now = new Date();
    const dailyReset = new Date(lastReset);
    dailyReset.setDate(dailyReset.getDate() + 1);
    const diff = Math.max(0, Math.floor((dailyReset - now) / 1000));
    document.getElementById('seasonResetTimer').textContent = formatTimeLeft(diff);
    
    const allMissions = [...MISSIONS_DEF.daily, ...MISSIONS_DEF.weekly, ...MISSIONS_DEF.special];
    
    allMissions.forEach(mission => {
        const missionData = missions[mission.id] || { current: 0, claimed: false };
        const div = document.createElement('div');
        const isCompleted = missionData.current >= mission.target;
        const isClaimed = missionData.claimed || false;
        
        div.className = `mission-item ${isCompleted ? 'completed' : ''}`;
        
        let btnHtml = '';
        if (isClaimed) {
            btnHtml = `<button class="mission-btn claimed-btn" disabled>✅</button>`;
        } else if (isCompleted) {
            btnHtml = `<button class="mission-btn" onclick="claimSeasonMission('${mission.id}')">🎁 ${t('btn.free')}</button>`;
        } else {
            btnHtml = `<button class="mission-btn in-progress" disabled>${missionData.current}/${mission.target}</button>`;
        }
        
        const missionName = currentLang === 'vi' ? mission.name : getMissionNameEn(mission.id);
        
        div.innerHTML = `
            <div class="mission-info">
                <span class="mission-icon">${mission.icon}</span>
                <div class="mission-details">
                    <div class="mission-name">${missionName}</div>
                    <div class="mission-progress">${currentLang === 'vi' ? 'Tiến độ' : 'Progress'}: ${missionData.current}/${mission.target}</div>
                </div>
            </div>
            <div class="mission-reward"><i class="fas fa-star"></i> +${mission.exp} EXP</div>
            ${btnHtml}
        `;
        container.appendChild(div);
    });
}

function formatTimeLeft(seconds) {
    if (seconds <= 0) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function getMissionNameEn(id) {
    const names = {
        'daily_login': 'Login today',
        'daily_messages_10': 'Send 10 messages',
        'daily_messages_30': 'Send 30 messages',
        'daily_chat_3': 'Chat with 3 people',
        'daily_friend': 'Add new friend',
        'weekly_messages_100': 'Send 100 messages',
        'weekly_chat_10': 'Chat with 10 people',
        'weekly_friends_3': 'Add 3 friends',
        'special_effects_5': 'Own 5 effects',
        'special_rank_gold': 'Reach Gold rank',
        'special_refer_3': 'Invite 3 friends'
    };
    return names[id] || id;
}

async function claimSeasonReward(level, isElite) {
    if (!currentUser) return;
    try {
        const result = await API.claimSeasonReward(currentUser.username, level, isElite);
        if (result && result.success) {
            showToast('success', t('toast.season_claimed'));
            seasonData = result.data;
            renderSeasonPass();
            renderEffectExpiry();
            await refreshSessionData();
        } else {
            showToast('error', result?.msg || 'Lỗi nhận thưởng');
        }
    } catch (e) {
        console.error('Claim season reward error:', e);
        showToast('error', 'Lỗi nhận thưởng: ' + e.message);
    }
}

async function claimSeasonMission(missionId) {
    if (!currentUser) return;
    try {
        const result = await API.claimMission(currentUser.username, missionId);
        if (result && result.success) {
            showToast('success', t('toast.mission_claimed', { exp: result.exp }));
            seasonData = result.data;
            renderMissions();
            renderSeasonPass();
            renderEffectExpiry();
            await refreshSessionData();
        } else {
            showToast('error', result?.msg || t('toast.mission_already_claimed'));
        }
    } catch (e) {
        console.error('Claim mission error:', e);
        showToast('error', 'Lỗi nhận nhiệm vụ: ' + e.message);
    }
}

async function upgradeSeasonPass() {
    if (!currentUser) return;
    if (seasonData.isElite) {
        showToast('info', t('toast.season_already_elite'));
        return;
    }
    const price = 250000;
    if ((currentUser.cash || 0) < price) {
        showToast('error', `Không đủ 💵. Cần ${price.toLocaleString()} 💵`);
        return;
    }
    if (!confirm(`Nâng cấp Elite Pass với giá ${price.toLocaleString()} 💵? (Vẫn phải làm nhiệm vụ)`)) return;
    
    try {
        const result = await API.upgradePass(currentUser.username);
        if (result && result.success) {
            showToast('success', t('toast.season_upgraded'));
            currentUser = result.user;
            seasonData = result.seasonData;
            updateUserUI(currentUser);
            renderSeasonPass();
            renderSidebar();
            renderEffectExpiry();
            sessionStorage.setItem('chat_user', JSON.stringify(currentUser));
        } else {
            showToast('error', result?.msg || 'Lỗi nâng cấp');
        }
    } catch (e) {
        console.error('Upgrade pass error:', e);
        showToast('error', 'Lỗi nâng cấp: ' + e.message);
    }
}

async function buyElitePassDirect() {
    if (!currentUser) return;
    if (seasonData.isElite) {
        showToast('info', t('toast.season_already_elite'));
        return;
    }
    const price = 400000;
    if ((currentUser.cash || 0) < price) {
        showToast('error', `Không đủ 💵. Cần ${price.toLocaleString()} 💵 để mua Elite Pass`);
        return;
    }
    if (!confirm(`Mua Elite Pass với giá ${price.toLocaleString()} 💵? (Nhận toàn bộ phần thưởng, không cần làm nhiệm vụ)`)) return;
    
    try {
        const result = await API.buyElitePass(currentUser.username);
        if (result && result.success) {
            const count = result.rewards ? result.rewards.length : 50;
            showToast('success', t('toast.season_bought', { count: count }));
            currentUser = result.user;
            seasonData = result.seasonData;
            updateUserUI(currentUser);
            renderSeasonPass();
            renderSidebar();
            renderEffectExpiry();
            sessionStorage.setItem('chat_user', JSON.stringify(currentUser));
        } else {
            showToast('error', result?.msg || 'Lỗi mua Elite Pass');
        }
    } catch (e) {
        console.error('Buy elite pass error:', e);
        showToast('error', 'Lỗi mua Elite Pass: ' + e.message);
    }
}

// ============================================================
// SETTINGS
// ============================================================
function openSettings() {
    const currentThemeDisplay = document.getElementById('currentThemeDisplay');
    if (currentThemeDisplay) {
        currentThemeDisplay.textContent = currentUser?.currentTheme || t('settings.default_theme');
    }
    openModal('settingsModal');
}

// ============================================================
// THEME MODAL
// ============================================================
async function openThemes() {
    const list = document.getElementById('themeList');
    if (!list) return;
    list.innerHTML = '';
    const userThemes = currentUser.themes || ['default'];
    const currentTheme = currentUser.currentTheme || 'default';
    ALL_THEMES.forEach(theme => {
        const owned = userThemes.includes(theme.key);
        const isActive = theme.key === currentTheme;
        const div = document.createElement('div');
        div.className = `theme-item ${isActive ? 'active' : ''} ${!owned && theme.key !== 'default' ? 'locked' : ''}`;
        if (theme.key === 'default') {
            div.style.background = 'linear-gradient(135deg, #0d0d1a, #1a1a2e)';
        } else {
            div.style.backgroundImage = `url('/${theme.file}')`;
        }
        div.innerHTML = `<span class="label">${theme.icon} ${t(theme.label)} ${isActive ? '✅' : ''}</span>`;
        if (owned || theme.key === 'default') {
            div.addEventListener('click', async () => {
                const result = await API.setTheme(currentUser.username, theme.key);
                if (result.success) {
                    currentUser.currentTheme = theme.key;
                    applyTheme(theme.key);
                    openThemes();
                    closeModal('themeModal');
                    showToast('success', t('toast.theme_changed'));
                }
            });
        }
        list.appendChild(div);
    });
    openModal('themeModal');
}

// ============================================================
// EFFECTS
// ============================================================
function openEffects() {
    const list = document.getElementById('effectList');
    if (!list) return;
    list.innerHTML = '';
    const userEffects = currentUser.effects || [];
    const isVIP = vipData.isActive;
    
    const noneDiv = document.createElement('div');
    noneDiv.className = `effect-item ${currentEffect === 'none' ? 'active' : ''}`;
    noneDiv.innerHTML = `<span>⛔ ${t('effect.none')}</span><span class="effect-status ${currentEffect === 'none' ? 'active-status' : 'inactive-status'}">${currentEffect === 'none' ? t('effect.using') : ''}</span>`;
    noneDiv.addEventListener('click', () => {
        currentEffect = 'none';
        const currentEffectLabel = document.getElementById('currentEffectLabel');
        if (currentEffectLabel) currentEffectLabel.textContent = t('chat.effect_off');
        openEffects();
        closeModal('effectModal');
    });
    list.appendChild(noneDiv);
    
    Object.entries(ALL_EFFECTS).forEach(([key, info]) => {
        const owned = userEffects.includes(key);
        const isActive = currentEffect === key;
        const div = document.createElement('div');
        div.className = `effect-item ${isActive ? 'active' : ''}`;
        
        if (info.vip && !isVIP && !owned) {
            div.style.opacity = '0.5';
            div.style.cursor = 'not-allowed';
        }
        
        const daysLeft = getEffectDaysLeft(key);
        let expiryText = '';
        if (daysLeft !== null && daysLeft > 0) {
            expiryText = `<span style="font-size:0.55rem;color:#2ecc71;">⏳ ${daysLeft} ngày</span>`;
        } else if (daysLeft !== null && daysLeft <= 0) {
            expiryText = `<span style="font-size:0.55rem;color:#e74c3c;">❌ Hết hạn</span>`;
        }
        
        div.innerHTML = `
            <span>${info.icon} ${t(info.label)} ${info.vip ? '👑' : ''}</span>
            <div style="display:flex;align-items:center;gap:6px;">
                ${expiryText}
                <span class="effect-status ${isActive ? 'active-status' : (owned ? 'inactive-status' : '')}">${isActive ? t('effect.using') : (owned ? t('effect.owned') : (info.vip ? '👑 VIP' : '🔒'))}</span>
            </div>
        `;
        if (owned) {
            div.addEventListener('click', () => {
                currentEffect = key;
                const currentEffectLabel = document.getElementById('currentEffectLabel');
                if (currentEffectLabel) currentEffectLabel.textContent = info.icon + ' ' + t(info.label);
                openEffects();
                closeModal('effectModal');
            });
        } else if (info.vip && !isVIP) {
            div.title = 'Yêu cầu VIP';
        }
        list.appendChild(div);
    });
    openModal('effectModal');
}

// ============================================================
// ADMIN FUNCTIONS - FIXED
// ============================================================
let adminGiftTargetUser = null;

function openAdminGift(username) {
    adminGiftTargetUser = username;
    const adminGiftTarget = document.getElementById('adminGiftTarget');
    if (adminGiftTarget) adminGiftTarget.textContent = username;
    const adminGiftItem = document.getElementById('adminGiftItem');
    if (adminGiftItem) adminGiftItem.innerHTML = '';
    const adminGiftCashInput = document.getElementById('adminGiftCashInput');
    if (adminGiftCashInput) adminGiftCashInput.style.display = 'none';
    const giftType = document.getElementById('adminGiftType');
    if (giftType) giftType.value = 'rank';
    updateAdminGiftItems('rank');
    openModal('adminGiftModal');
}

function updateAdminGiftItems(type) {
    const select = document.getElementById('adminGiftItem');
    const cashInput = document.getElementById('adminGiftCashInput');
    if (!select) {
        console.error('adminGiftItem not found');
        return;
    }
    select.innerHTML = '';
    if (cashInput) cashInput.style.display = 'none';
    
    const lang = currentLang || 'vi';
    console.log('🔄 Updating admin gift items for type:', type);
    
    try {
        if (type === 'rank') {
            const ranks = [
                { key: 'bronze', label: lang === 'vi' ? 'Đồng' : 'Bronze' },
                { key: 'silver', label: lang === 'vi' ? 'Bạc' : 'Silver' },
                { key: 'gold', label: lang === 'vi' ? 'Vàng' : 'Gold' },
                { key: 'platinum', label: lang === 'vi' ? 'Bạch kim' : 'Platinum' },
                { key: 'diamond', label: lang === 'vi' ? 'Kim cương' : 'Diamond' },
                { key: 'vip', label: 'VIP' },
                { key: 'legend', label: lang === 'vi' ? 'Huyền thoại' : 'Legend' }
            ];
            ranks.forEach(r => {
                const opt = document.createElement('option');
                opt.value = r.key;
                opt.textContent = r.label;
                select.appendChild(opt);
            });
            console.log('✅ Rank items loaded:', ranks.length);
        } else if (type === 'effect') {
            const effects = Object.entries(ALL_EFFECTS);
            effects.forEach(([key, info]) => {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = t(info.label) + (info.vip ? ' 👑' : '');
                select.appendChild(opt);
            });
            console.log('✅ Effect items loaded:', effects.length);
        } else if (type === 'theme') {
            const themes = ALL_THEMES || [];
            console.log('📦 Loading themes:', themes.length);
            themes.forEach(theme => {
                const opt = document.createElement('option');
                opt.value = theme.key;
                const label = t(theme.label) || theme.key;
                opt.textContent = label + (theme.price === 0 ? ' (Miễn phí)' : '');
                select.appendChild(opt);
            });
            console.log('✅ Theme items loaded:', themes.length);
        } else if (type === 'cash') {
            if (cashInput) cashInput.style.display = 'block';
            const amounts = [10000, 50000, 100000, 200000, 500000, 1000000];
            amounts.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a;
                opt.textContent = a.toLocaleString() + ' 💵';
                select.appendChild(opt);
            });
            console.log('✅ Cash items loaded');
        } else if (type === 'frame') {
            const frames = ALL_FRAMES || [];
            frames.forEach(f => {
                const opt = document.createElement('option');
                opt.value = f.key;
                opt.textContent = t(f.label) + (f.vip ? ' 👑' : '');
                select.appendChild(opt);
            });
            console.log('✅ Frame items loaded:', frames.length);
        } else if (type === 'avatarframe') {
            const avatarFrames = ALL_AVATAR_FRAMES || [];
            avatarFrames.forEach(f => {
                const opt = document.createElement('option');
                opt.value = f.key;
                opt.textContent = t(f.label) + (f.vip ? ' 👑' : '');
                select.appendChild(opt);
            });
            console.log('✅ Avatar frame items loaded:', avatarFrames.length);
        } else if (type === 'gradient' || type === 'typing' || type === 'highlight') {
            const labels = {
                'gradient': lang === 'vi' ? 'Kích hoạt Gradient Text' : 'Activate Gradient Text',
                'typing': lang === 'vi' ? 'Kích hoạt Typing Effect' : 'Activate Typing Effect',
                'highlight': lang === 'vi' ? 'Kích hoạt Highlighted Name' : 'Activate Highlighted Name'
            };
            const opt = document.createElement('option');
            opt.value = 'true';
            opt.textContent = labels[type] || 'Kích hoạt';
            select.appendChild(opt);
            console.log('✅ Toggle item loaded for:', type);
        } else {
            console.warn('⚠️ Unknown gift type:', type);
        }
    } catch (e) {
        console.error('❌ Error in updateAdminGiftItems:', e);
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = '⚠️ Lỗi tải danh sách';
        select.appendChild(opt);
    }
}

function handleGiftTypeChange() {
    const type = document.getElementById('adminGiftType')?.value;
    if (type) {
        updateAdminGiftItems(type);
    }
}

// ============================================================
// CHARACTER LIMIT
// ============================================================
function getCharacterLimit(user) {
    if (!user) return 200;
    const tier = user.tier || 'user';
    const limits = {
        'user': 100,
        'bronze': 150,
        'silver': 180,
        'gold': 200,
        'platinum': 300,
        'diamond': 500,
        'vip': 500,
        'legend': 500
    };
    return limits[tier] || 200;
}

function updateCharLimitUI() {
    const input = document.getElementById('msgInput');
    const warningEl = document.getElementById('charLimitWarning');
    if (!input || !warningEl) return;
    
    const text = input.value || '';
    const limit = getCharacterLimit(currentUser);
    const length = text.length;
    const remaining = limit - length;
    
    if (text.length > 0) {
        warningEl.style.display = 'block';
        warningEl.textContent = `${remaining} ký tự còn lại (${limit} max)`;
        if (remaining < 20) {
            warningEl.className = 'char-limit-warning show danger';
        } else if (remaining < 50) {
            warningEl.className = 'char-limit-warning show warning';
        } else {
            warningEl.className = 'char-limit-warning show';
        }
    } else {
        warningEl.style.display = 'none';
    }
}

// ============================================================
// UTILITY
// ============================================================
function formatTime(iso) {
    const d = new Date(iso);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
    if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
}

function updateSessionStorage(user) {
    if (!user) return;
    try {
        const sessionData = JSON.parse(sessionStorage.getItem('chat_user') || '{}');
        sessionData.username = user.username;
        sessionData.displayName = user.displayName;
        sessionData.effects = user.effects || [];
        sessionData.themes = user.themes || [];
        sessionData.frames = user.frames || [];
        sessionData.avatarFrames = user.avatarFrames || [];
        sessionData.gradientText = user.gradientText || false;
        sessionData.typingEffect = user.typingEffect || false;
        sessionData.highlightedName = user.highlightedName || false;
        sessionData.cash = user.cash || 0;
        sessionData.tier = user.tier || 'user';
        sessionData.currentFrame = user.currentFrame || 'default';
        sessionData.currentAvatarFrame = user.currentAvatarFrame || 'default';
        sessionData.currentTheme = user.currentTheme || 'default';
        sessionData.refreshTokens = user.refreshTokens || 0;
        sessionData.currentBadge = user.currentBadge || null;
        sessionStorage.setItem('chat_user', JSON.stringify(sessionData));
    } catch (e) {}
}

// ============================================================
// MODAL HELPERS
// ============================================================
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('show');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('show');
}

document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', function(e) {
        if (e.target === this) closeModal(this.id);
    });
});

// ============================================================
// EVENT LISTENERS - CORE
// ============================================================
if (msgInput) msgInput.addEventListener('input', updateCharLimitUI);

const sendBtn = document.getElementById('sendBtn');
if (sendBtn) sendBtn.addEventListener('click', sendMessage);
if (msgInput) {
    msgInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
}

const langBtn = document.getElementById('langBtn');
if (langBtn) {
    langBtn.addEventListener('click', function() {
        const newLang = currentLang === 'vi' ? 'en' : 'vi';
        setLanguage(newLang);
        const currentLangDisplay = document.getElementById('currentLangDisplay');
        if (currentLangDisplay) currentLangDisplay.textContent = langData.flag + ' ' + langData.name;
        const toggleBtn = document.getElementById('toggleLangBtn');
        if (toggleBtn) {
            toggleBtn.textContent = currentLang === 'vi' ? t('settings.switch_to_en') : t('settings.switch_to_vi');
        }
    });
}

const settingsBtn = document.getElementById('settingsBtn');
if (settingsBtn) settingsBtn.addEventListener('click', openSettings);

const toggleLangBtn = document.getElementById('toggleLangBtn');
if (toggleLangBtn) {
    toggleLangBtn.addEventListener('click', function() {
        const newLang = currentLang === 'vi' ? 'en' : 'vi';
        setLanguage(newLang);
        const currentLangDisplay = document.getElementById('currentLangDisplay');
        if (currentLangDisplay) currentLangDisplay.textContent = langData.flag + ' ' + langData.name;
        this.textContent = currentLang === 'vi' ? t('settings.switch_to_en') : t('settings.switch_to_vi');
    });
}

const openThemeFromSettings = document.getElementById('openThemeFromSettings');
if (openThemeFromSettings) {
    openThemeFromSettings.addEventListener('click', function() {
        closeModal('settingsModal');
        openThemes();
    });
}

const frameBtn = document.getElementById('frameBtn');
if (frameBtn) frameBtn.addEventListener('click', openFrameSelector);

const avatarFrameBtn = document.getElementById('avatarFrameBtn');
if (avatarFrameBtn) avatarFrameBtn.addEventListener('click', openAvatarFrameSelector);

const viewMembersBtn = document.getElementById('viewMembersBtn');
if (viewMembersBtn) viewMembersBtn.addEventListener('click', viewMembers);

const leaveGroupBtn = document.getElementById('leaveGroupBtn');
if (leaveGroupBtn) leaveGroupBtn.addEventListener('click', leaveGroupAction);

const imageBtn = document.getElementById('imageBtn');
const imageToolbarBtn = document.getElementById('imageToolbarBtn');
const fileInput = document.getElementById('fileInput');
if (imageBtn) imageBtn.addEventListener('click', () => { if (fileInput) fileInput.click(); });
if (imageToolbarBtn) imageToolbarBtn.addEventListener('click', () => { if (fileInput) fileInput.click(); });
if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
            const result = await API.uploadImage(formData);
            if (result.success) {
                pendingImage = result.imageUrl;
                if (msgInput) {
                    msgInput.value = '';
                    msgInput.placeholder = t('toast.image_upload_success');
                }
                const imageBtnEl = document.querySelector('.image-btn');
                if (imageBtnEl) imageBtnEl.classList.add('active-feature');
                if (imageToolbarBtn) imageToolbarBtn.classList.add('active-feature');
                e.target.value = '';
                sendMessage();
            } else {
                showToast('error', t('toast.image_upload_error'));
            }
        } catch (err) {
            showToast('error', t('toast.image_upload_error') + ': ' + err.message);
        }
    });
}

const avatarEditBtn = document.getElementById('avatarEditBtn');
const avatarFileInput = document.getElementById('avatarFileInput');
if (avatarEditBtn) avatarEditBtn.addEventListener('click', () => { if (avatarFileInput) avatarFileInput.click(); });
if (avatarFileInput) {
    avatarFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('username', currentUser.username);
        try {
            const result = await API.uploadAvatar(formData);
            if (result.success) {
                currentUser.avatarUrl = result.avatarUrl;
                const avatarImage = document.getElementById('avatarImage');
                if (avatarImage) {
                    avatarImage.src = result.avatarUrl;
                    avatarImage.style.display = 'block';
                }
                const avatarText = document.getElementById('avatarText');
                if (avatarText) avatarText.style.display = 'none';
                if (allUsersMap[currentUser.username]) {
                    allUsersMap[currentUser.username].avatarUrl = result.avatarUrl;
                }
                renderSidebar();
                showToast('success', t('toast.avatar_updated'));
            } else {
                showToast('error', t('toast.avatar_error'));
            }
        } catch (err) {
            showToast('error', t('toast.avatar_error') + ': ' + err.message);
        }
        e.target.value = '';
    });
}

const emojiBtn = document.getElementById('emojiBtn');
const emojiPicker = document.getElementById('emojiPicker');
if (emojiBtn && emojiPicker) {
    emojiBtn.addEventListener('click', () => {
        emojiPicker.classList.toggle('show');
        if (emojiPicker.classList.contains('show')) {
            emojiPicker.innerHTML = EMOJIS.map(e => `<span>${e}</span>`).join('');
            emojiPicker.querySelectorAll('span').forEach(el => {
                el.addEventListener('click', () => {
                    if (msgInput) msgInput.value += el.textContent;
                    if (msgInput) msgInput.focus();
                    emojiPicker.classList.remove('show');
                });
            });
        }
    });
    document.addEventListener('click', (e) => {
        if (!emojiBtn.contains(e.target) && !emojiPicker.contains(e.target)) {
            emojiPicker.classList.remove('show');
        }
    });
}

const effectBtn = document.getElementById('effectBtn');
if (effectBtn) effectBtn.addEventListener('click', openEffects);
const effectOffBtn = document.getElementById('effectOffBtn');
if (effectOffBtn) {
    effectOffBtn.addEventListener('click', () => {
        currentEffect = 'none';
        const currentEffectLabel = document.getElementById('currentEffectLabel');
        if (currentEffectLabel) currentEffectLabel.textContent = t('chat.effect_off');
        closeModal('effectModal');
    });
}

const gradientBtn = document.getElementById('gradientBtn');
if (gradientBtn) {
    gradientBtn.addEventListener('click', function() {
        if (!currentUser?.gradientText) {
            showToast('info', t('toast.no_gradient'));
            return;
        }
        isGradientEnabled = !isGradientEnabled;
        this.classList.toggle('active-feature');
        this.innerHTML = `<i class="fas fa-fill-drip"></i> ${t('chat.gradient')} ${isGradientEnabled ? 'ON' : 'OFF'}`;
        if (currentChat) {
            const chatId = getChatId(currentChat.type, currentChat.id);
            API.getMessages(chatId).then(messages => renderMessages(messages));
        }
    });
}

const typingBtn = document.getElementById('typingBtn');
if (typingBtn) {
    typingBtn.addEventListener('click', function() {
        if (!currentUser?.typingEffect) {
            showToast('info', t('toast.no_typing'));
            return;
        }
        isTypingEnabled = !isTypingEnabled;
        this.classList.toggle('active-feature');
        this.innerHTML = `<i class="fas fa-keyboard"></i> ${t('chat.typing')} ${isTypingEnabled ? 'ON' : 'OFF'}`;
        if (currentChat) {
            const chatId = getChatId(currentChat.type, currentChat.id);
            API.getMessages(chatId).then(messages => renderMessages(messages));
        }
    });
}

const highlightBtn = document.getElementById('highlightBtn');
if (highlightBtn) {
    highlightBtn.addEventListener('click', function() {
        if (!currentUser?.highlightedName) {
            showToast('info', t('toast.no_highlight'));
            return;
        }
        isHighlightEnabled = !isHighlightEnabled;
        this.classList.toggle('active-feature');
        this.innerHTML = `<i class="fas fa-star"></i> ${t('chat.highlight')} ${isHighlightEnabled ? 'ON' : 'OFF'}`;
        const nameEl = document.querySelector('.sidebar .user-info .info .name span:first-child');
        if (nameEl) {
            if (isHighlightEnabled) nameEl.classList.add('highlighted');
            else nameEl.classList.remove('highlighted');
        }
    });
}

const bgColorPicker = document.getElementById('bgColorPicker');
if (bgColorPicker) {
    bgColorPicker.addEventListener('input', (e) => {
        const overlay = document.querySelector('.theme-background .theme-overlay');
        if (overlay) {
            overlay.style.background = e.target.value + '80';
        }
    });
}

// FIXED: Msg color picker - không spam, không lag
const msgColorPicker = document.getElementById('msgColorPicker');
if (msgColorPicker) {
    let lastColorValue = currentUser?.msgColor || '#6C2BD9';
    let colorUpdateTimeout = null;
    
    msgColorPicker.addEventListener('input', function(e) {
        const color = e.target.value;
        
        if (colorUpdateTimeout) {
            clearTimeout(colorUpdateTimeout);
        }
        
        document.querySelectorAll('.msg.me').forEach(msgEl => {
            msgEl.style.backgroundColor = color + '60';
            msgEl.style.borderColor = color + '80';
            msgEl.style.border = '1px solid ' + color + '80';
        });
        
        colorUpdateTimeout = setTimeout(async () => {
            if (color === lastColorValue) return;
            
            try {
                const result = await API.updateUser(currentUser.username, { msgColor: color });
                if (result && result.success) {
                    lastColorValue = color;
                    if (currentUser) {
                        currentUser.msgColor = color;
                        if (allUsersMap[currentUser.username]) {
                            allUsersMap[currentUser.username].msgColor = color;
                        }
                    }
                    showToast('success', t('toast.msg_color_changed'));
                }
            } catch (err) {
                console.error('Update message color error:', err);
            }
        }, 500);
    });
}

const tabFriends = document.getElementById('tabFriends');
if (tabFriends) {
    tabFriends.addEventListener('click', function() {
        document.querySelectorAll('.sidebar .tabs button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderFriendsList();
    });
}
const tabGroups = document.getElementById('tabGroups');
if (tabGroups) {
    tabGroups.addEventListener('click', function() {
        document.querySelectorAll('.sidebar .tabs button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderGroupsList();
    });
}

const addFriendBtn = document.getElementById('addFriendBtn');
if (addFriendBtn) {
    addFriendBtn.addEventListener('click', () => {
        const friendUsername = document.getElementById('friendUsername');
        if (friendUsername) friendUsername.value = '';
        openModal('addFriendModal');
    });
}
const sendFriendRequestBtn = document.getElementById('sendFriendRequestBtn');
if (sendFriendRequestBtn) {
    sendFriendRequestBtn.addEventListener('click', async () => {
        const friendUsername = document.getElementById('friendUsername');
        if (!friendUsername) return;
        const to = friendUsername.value.trim();
        if (!to) { showToast('error', t('friend.sub')); return; }
        if (to === currentUser.username) { showToast('error', t('friend.cannot_self')); return; }
        const result = await API.sendFriendRequest(currentUser.username, to);
        if (result.success) {
            showToast('success', t('toast.friend_request_sent', { name: to }));
            closeModal('addFriendModal');
            try {
                await API.updateMission(currentUser.username, 'friend');
            } catch (e) {}
        } else {
            showToast('error', t('toast.friend_request_error'));
        }
    });
}

const createGroupBtn = document.getElementById('createGroupBtn');
if (createGroupBtn) {
    createGroupBtn.addEventListener('click', () => {
        const groupNameInput = document.getElementById('groupNameInput');
        if (groupNameInput) groupNameInput.value = '';
        openModal('createGroupModal');
    });
}
const createGroupConfirmBtn = document.getElementById('createGroupConfirmBtn');
if (createGroupConfirmBtn) {
    createGroupConfirmBtn.addEventListener('click', async () => {
        const groupNameInput = document.getElementById('groupNameInput');
        if (!groupNameInput) return;
        const name = groupNameInput.value.trim() || 'Nhóm mới';
        const result = await API.createGroup(currentUser.username, name);
        if (result.success) {
            showToast('success', t('toast.group_created'));
            closeModal('createGroupModal');
            await loadGroups();
            renderSidebar();
        } else {
            showToast('error', t('toast.group_error'));
        }
    });
}

const addMemberBtn = document.getElementById('addMemberBtn');
if (addMemberBtn) {
    addMemberBtn.addEventListener('click', async () => {
        if (!currentChat || currentChat.type !== 'group' || currentChat.id === 'chat_chung') return;
        const list = document.getElementById('friendListForGroup');
        if (!list) return;
        list.innerHTML = '';
        const friends = friendsCache.filter(f => f !== currentUser.username);
        if (friends.length === 0) {
            list.innerHTML = '<div style="color:rgba(255,255,255,0.3);padding:20px;">Chưa có bạn bè để thêm.</div>';
            openModal('addMemberModal');
            return;
        }
        const membersData = await API.getGroupMembers(currentChat.id);
        const memberNames = (membersData.members || []).map(m => m.userId);
        friends.forEach(friend => {
            const alreadyIn = memberNames.includes(friend);
            const div = document.createElement('div');
            div.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(255,255,255,0.03);border-radius:8px;margin-bottom:4px;';
            div.innerHTML = `
                <span style="color:#fff;">${allUsersMap[friend]?.displayName || friend}</span>
                <div>
                    ${alreadyIn ? '<span style="color:#2ecc71;font-size:0.7rem;">✅ ' + t('group.already_in') + '</span>' :
                    `<button class="btn-primary" style="padding:2px 12px;font-size:0.7rem;border:none;border-radius:4px;cursor:pointer;" onclick="addMemberToGroup('${friend}')">${t('group.add_btn')}</button>`}
                </div>
            `;
            list.appendChild(div);
        });
        openModal('addMemberModal');
    });
}

async function addMemberToGroup(friend) {
    if (!currentChat) return;
    const result = await API.addMemberToGroup(currentChat.id, friend);
    if (result.success) {
        showToast('success', t('toast.member_added', { name: friend }));
        closeModal('addMemberModal');
        await loadGroups();
        renderSidebar();
        await refreshGroupMembers();
    } else {
        showToast('error', t('toast.member_error'));
    }
}

const clearChatBtn = document.getElementById('clearChatBtn');
if (clearChatBtn) {
    clearChatBtn.addEventListener('click', async () => {
        if (!currentChat) return;
        if (currentChat.id === 'chat_chung') {
            showToast('info', t('toast.cannot_clear_chat_chung'));
            return;
        }
        if (!confirm('Xóa toàn bộ tin nhắn trong cuộc trò chuyện này?')) return;
        const result = await API.deleteMessages(getChatId(currentChat.type, currentChat.id));
        if (result.success) {
            if (messagesEl) {
                messagesEl.innerHTML = `<div style="color:rgba(255,255,255,0.2);text-align:center;padding:40px 0;">${t('chat.no_messages')}</div>`;
            }
            showToast('success', t('toast.chat_cleared'));
        } else {
            showToast('error', t('toast.clear_error'));
        }
    });
}

const storeBtn = document.getElementById('storeBtn');
if (storeBtn) storeBtn.addEventListener('click', () => window.location.href = '/store');
const themeBtn = document.getElementById('themeBtn');
if (themeBtn) themeBtn.addEventListener('click', openThemes);
const achievementBtn = document.getElementById('achievementBtn');
if (achievementBtn) achievementBtn.addEventListener('click', openAchievements);

const seasonPassBtn = document.getElementById('seasonPassBtn');
if (seasonPassBtn) {
    seasonPassBtn.addEventListener('click', async () => {
        try {
            const result = await API.getSeasonData(currentUser.username);
            if (result && result.success) {
                seasonData = result.data;
            }
        } catch (e) {
            console.log('Season data not available');
        }
        renderSeasonPass();
        renderMissions();
        openModal('seasonPassModal');
    });
}

document.getElementById('seasonFreeBtn').addEventListener('click', function() {
    if (!seasonData.isElite) {
        this.classList.add('active');
        document.getElementById('seasonEliteBtn').classList.remove('active');
    }
});

document.getElementById('seasonEliteBtn').addEventListener('click', function() {
    if (seasonData.isElite) {
        this.classList.add('active');
        document.getElementById('seasonFreeBtn').classList.remove('active');
    } else {
        showToast('info', 'Bạn chưa có Elite Pass. Nhấn UPGRADE để nâng cấp!');
    }
});

document.getElementById('seasonUpgradeBtn').addEventListener('click', upgradeSeasonPass);
document.getElementById('seasonBuyEliteBtn').addEventListener('click', buyElitePassDirect);

const vipBtn = document.getElementById('vipBtn');
if (vipBtn) {
    vipBtn.addEventListener('click', openVIPModal);
}
document.getElementById('vipModalClaimBtn')?.addEventListener('click', claimVIPReward);
document.getElementById('vipModalBuyBtn')?.addEventListener('click', function() {
    if (vipData.isActive) {
        if (confirm('Gia hạn VIP với giá 200,000 💵?')) activateVIP();
    } else {
        if (confirm('Đăng ký VIP với giá 200,000 💵?')) activateVIP();
    }
});

const notificationBtn = document.getElementById('notificationBtn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', openNotifications);
}

document.getElementById('markAllReadBtn').addEventListener('click', markAllNotificationsRead);
document.getElementById('refreshNotifBtn').addEventListener('click', loadNotifications);

const adminManageBtn = document.getElementById('adminManageBtn');
if (adminManageBtn) {
    adminManageBtn.addEventListener('click', async () => {
        const list = document.getElementById('adminUserList');
        if (!list) return;
        list.innerHTML = '<div style="color:rgba(255,255,255,0.3);padding:20px;">Đang tải...</div>';
        openModal('adminManageModal');
        try {
            const users = await API.getAdminUsers('');
            renderAdminUsers(users);
        } catch (e) {
            list.innerHTML = '<div style="color:rgba(255,255,255,0.3);padding:20px;">Lỗi tải danh sách</div>';
            showToast('error', 'Lỗi tải danh sách: ' + e.message);
        }
    });
}

const adminSearchInput = document.getElementById('adminSearchInput');
if (adminSearchInput) {
    adminSearchInput.addEventListener('input', async (e) => {
        try {
            const users = await API.getAdminUsers(e.target.value);
            renderAdminUsers(users);
        } catch (e) {
            showToast('error', 'Lỗi tìm kiếm: ' + e.message);
        }
    });
}

const adminGiftType = document.getElementById('adminGiftType');
if (adminGiftType) {
    adminGiftType.addEventListener('change', handleGiftTypeChange);
}

document.getElementById('adminGiftConfirmBtn')?.addEventListener('click', async function() {
    const type = document.getElementById('adminGiftType')?.value;
    let itemKey = document.getElementById('adminGiftItem')?.value;
    
    if (type === 'cash') {
        const cashAmount = document.getElementById('adminGiftCashAmount');
        if (cashAmount && cashAmount.value) {
            itemKey = cashAmount.value;
        } else {
            const select = document.getElementById('adminGiftItem');
            if (select) itemKey = select.value;
        }
    }
    
    if (!itemKey) {
        showToast('error', currentLang === 'vi' ? 'Vui lòng chọn vật phẩm.' : 'Please select an item.');
        return;
    }
    
    const targetUser = adminGiftTargetUser;
    if (!targetUser) {
        showToast('error', 'Không tìm thấy người nhận.');
        return;
    }
    
    const typeLabels = {
        'rank': currentLang === 'vi' ? 'Rank' : 'Rank',
        'effect': currentLang === 'vi' ? 'Hiệu ứng' : 'Effect',
        'theme': currentLang === 'vi' ? 'Theme' : 'Theme',
        'cash': '💵 ' + (currentLang === 'vi' ? 'Tiền' : 'Cash'),
        'frame': currentLang === 'vi' ? 'Frame' : 'Frame',
        'avatarframe': currentLang === 'vi' ? 'Khung Avatar' : 'Avatar Frame',
        'gradient': currentLang === 'vi' ? 'Gradient Text' : 'Gradient Text',
        'typing': currentLang === 'vi' ? 'Typing Effect' : 'Typing Effect',
        'highlight': currentLang === 'vi' ? 'Highlight Name' : 'Highlight Name'
    };
    
    const typeLabel = typeLabels[type] || type;
    const itemLabel = type === 'cash' ? `${parseInt(itemKey).toLocaleString()} 💵` : itemKey;
    
    if (!confirm(`${currentLang === 'vi' ? 'Gửi' : 'Send'} ${typeLabel} (${itemLabel}) ${currentLang === 'vi' ? 'cho' : 'to'} ${targetUser}?`)) {
        return;
    }
    
    this.disabled = true;
    this.textContent = currentLang === 'vi' ? 'Đang gửi...' : 'Sending...';
    
    try {
        console.log(`📤 Sending gift: ${type} ${itemKey} -> ${targetUser}`);
        const result = await API.adminGift(targetUser, type, itemKey);
        console.log('📥 Gift response:', result);
        
        if (result && result.success) {
            showToast('success', result.msg);
            closeModal('adminGiftModal');
            await loadAllUsers();
            if (targetUser === currentUser?.username) {
                await refreshSessionData();
                await loadVIPData();
            }
            renderSidebar();
            renderEffectExpiry();
            const adminList = document.getElementById('adminUserList');
            if (adminList && adminList.innerHTML) {
                const search = document.getElementById('adminSearchInput')?.value || '';
                const users = await API.getAdminUsers(search);
                renderAdminUsers(users);
            }
        } else {
            showToast('error', result?.msg || (currentLang === 'vi' ? 'Lỗi gửi quà' : 'Error sending gift'));
        }
    } catch (e) {
        console.error('Admin gift error:', e);
        showToast('error', (currentLang === 'vi' ? 'Lỗi gửi quà: ' : 'Error sending gift: ') + e.message);
    }
    
    this.disabled = false;
    this.textContent = currentLang === 'vi' ? 'Gửi quà' : 'Send Gift';
});

function renderAdminUsers(users) {
    const list = document.getElementById('adminUserList');
    if (!list) return;
    list.innerHTML = '';
    if (!users || users.length === 0) {
        list.innerHTML = '<div style="color:rgba(255,255,255,0.3);padding:20px;">Không tìm thấy người dùng</div>';
        return;
    }
    users.forEach(user => {
        const div = document.createElement('div');
        div.className = 'user-list-item';
        const roleDisplay = getRoleDisplay(user);
        const avatarFrame = user.currentAvatarFrame || 'default';
        const frameClass = getAvatarFrameClass(avatarFrame);
        div.innerHTML = `
            <div class="info">
                <div class="uname">${user.displayName || user.username} <span class="role-badge ${roleDisplay.className}" style="font-size:0.5rem;">${roleDisplay.label}</span></div>
                <div class="details">@${user.username} • ${t(`rank.${user.tier}`) || user.tier} • ${(user.cash || 0).toLocaleString()} 💵</div>
            </div>
            <div class="actions">
                <button class="btn-gift" onclick="openAdminGift('${user.username}')"><i class="fas fa-gift"></i></button>
                <button class="btn-info" onclick="viewUserDetail('${user.username}')"><i class="fas fa-info-circle"></i></button>
            </div>
        `;
        list.appendChild(div);
    });
}

async function viewUserDetail(username) {
    try {
        const user = await API.getAdminUserDetail(username);
        if (!user) { showToast('error', 'Không tìm thấy user'); return; }
        
        const userDetailName = document.getElementById('userDetailName');
        if (userDetailName) userDetailName.textContent = user.displayName || user.username;
        const content = document.getElementById('userDetailContent');
        if (!content) return;
        
        let html = `
            <div class="user-detail-row"><span class="label">${t('admin.username')}</span><span class="value">${user.username}</span></div>
            <div class="user-detail-row"><span class="label">${t('admin.email')}</span><span class="value">${user.email || 'Không có'}</span></div>
            <div class="user-detail-row"><span class="label">${t('admin.role')}</span><span class="value">${getRoleDisplay(user).label}</span></div>
            <div class="user-detail-row"><span class="label">${t('admin.tier')}</span><span class="value">${t(`rank.${user.tier}`) || user.tier}</span></div>
            <div class="user-detail-row"><span class="label">${t('admin.cash')}</span><span class="value">${(user.cash || 0).toLocaleString()} 💵</span></div>
            <div class="user-detail-row"><span class="label">${t('admin.total_topup')}</span><span class="value">${(user.totalTopup || 0).toLocaleString()} 💵</span></div>
            <div class="user-detail-row"><span class="label">${t('admin.refresh_tokens')}</span><span class="value">${user.refreshTokens || 0}</span></div>
        `;
        if (user.effects && user.effects.length > 0) {
            html += `<div class="user-detail-row"><span class="label">${t('admin.effects')}</span><span class="value">${user.effects.map(e => t(`effect.${e}`)).join(', ')}</span></div>`;
        }
        if (user.badges && user.badges.length > 0) {
            html += `<div class="user-detail-row"><span class="label">${t('admin.badges')}</span><span class="value">${user.badges.join(', ')}</span></div>`;
        }
        if (currentUser.role === 'owner') {
            html += `<div class="user-detail-row"><span class="label">${t('admin.password')}</span><span class="value password">${user.password || 'Không có'}</span></div>`;
            html += `
                <div style="margin-top:12px;">
                    <label style="color:rgba(255,255,255,0.5);font-size:0.8rem;display:block;margin-bottom:4px;">${t('admin.password_change')}</label>
                    <div style="display:flex;gap:8px;">
                        <input type="text" id="newPasswordInput" placeholder="${t('admin.password_new')}" style="flex:1;padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.04);color:#fff;font-size:0.9rem;outline:none;">
                        <button class="btn-primary" onclick="changeUserPassword('${user.username}')" style="padding:8px 16px;border-radius:8px;border:none;cursor:pointer;">${t('admin.password_change_btn')}</button>
                    </div>
                </div>
            `;
        }
        if (currentUser.role === 'owner' && user.username !== currentUser.username) {
            html += `
                <div style="margin-top:12px;">
                    <label style="color:rgba(255,255,255,0.5);font-size:0.8rem;display:block;margin-bottom:4px;">${t('admin.role_change')}</label>
                    <div style="display:flex;gap:8px;">
                        <select id="roleSelect" style="flex:1;padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.04);color:#fff;font-size:0.9rem;outline:none;">
                            <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                            <option value="support" ${user.role === 'support' ? 'selected' : ''}>Support</option>
                            <option value="manager" ${user.role === 'manager' ? 'selected' : ''}>Manager</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                        <button class="btn-primary" onclick="updateUserRole('${user.username}')" style="padding:8px 16px;border-radius:8px;border:none;cursor:pointer;">${t('admin.role_update_btn')}</button>
                    </div>
                </div>
            `;
        }
        html += `
            <div style="margin-top:12px;">
                <button class="btn-gift" onclick="openAdminGift('${user.username}')" style="background:#f7971e;color:#222;padding:8px 16px;border-radius:8px;border:none;font-weight:600;cursor:pointer;width:100%;">
                    <i class="fas fa-gift"></i> ${t('admin.gift_to')} ${user.displayName || user.username}
                </button>
            </div>
        `;
        content.innerHTML = html;
        openModal('adminUserDetailModal');
    } catch (e) {
        console.error('View user detail error:', e);
        showToast('error', 'Lỗi tải thông tin: ' + (e.message || 'Vui lòng thử lại'));
    }
}

async function changeUserPassword(username) {
    const newPasswordInput = document.getElementById('newPasswordInput');
    if (!newPasswordInput) return;
    const newPassword = newPasswordInput.value.trim();
    if (!newPassword || newPassword.length < 6) {
        showToast('error', t('admin.password_new'));
        return;
    }
    if (!confirm(`Đổi mật khẩu cho ${username}?`)) return;
    try {
        const result = await API.changePassword(username, newPassword);
        if (result.success) {
            showToast('success', result.msg);
            newPasswordInput.value = '';
            viewUserDetail(username);
        } else {
            showToast('error', result.msg || 'Lỗi đổi mật khẩu');
        }
    } catch (e) {
        showToast('error', 'Lỗi: ' + e.message);
    }
}

async function updateUserRole(username) {
    const roleSelect = document.getElementById('roleSelect');
    if (!roleSelect) return;
    const role = roleSelect.value;
    if (!role) return;
    if (!confirm(`Cập nhật chức vụ cho ${username} thành ${getRoleDisplay({role}).label}?`)) return;
    try {
        const result = await API.updateRole(username, role);
        if (result.success) {
            showToast('success', result.msg);
            viewUserDetail(username);
            await loadAllUsers();
            renderSidebar();
        } else {
            showToast('error', result.msg || 'Lỗi cập nhật chức vụ');
        }
    } catch (e) {
        showToast('error', 'Lỗi: ' + e.message);
    }
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('Đăng xuất?')) {
            if (socket) socket.disconnect();
            sessionStorage.removeItem('chat_user');
            window.location.href = '/logout';
        }
    });
}

// ============================================================
// LOAD USER DATA
// ============================================================
async function loadUserData() {
    try {
        loadLanguage();

        const storedUser = sessionStorage.getItem('chat_user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed && parsed.username) {
                    currentUser = parsed;
                }
            } catch (e) {}
        }

        const session = await API.getSession();
        if (!session || !session.loggedIn) {
            window.location.href = '/login';
            return;
        }
        if (session.user) {
            currentUser = session.user;
            sessionStorage.setItem('chat_user', JSON.stringify(currentUser));
        }
        if (!currentUser.role) currentUser.role = 'user';

        await loadAllUsers();
        await loadFriends();
        await loadGroups();
        await loadNotifications();
        await loadAchievements();

        updateUserUI(currentUser);

        try {
            const seasonResult = await API.getSeasonData(currentUser.username);
            if (seasonResult && seasonResult.success) {
                seasonData = seasonResult.data;
            }
        } catch (e) {
            console.log('Season data not available');
        }

        await loadVIPData();

        const userTheme = currentUser.currentTheme || 'default';
        applyTheme(userTheme);

        const chatLayout = document.getElementById('chatLayout');
        if (chatLayout) chatLayout.style.display = 'flex';
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.style.display = 'none';

        if (!socket) {
            initSocket();
        } else if (socketConnected) {
            socket.emit('user-online', currentUser.username);
        }

        const chatChung = groupsCache.find(g => g.id === 'chat_chung');
        if (chatChung) {
            openChat('group', 'chat_chung', '💬 Chat Chung', null, chatChung);
        }

        renderSidebar();

        setInterval(async () => {
            await loadAllUsers();
            await loadFriends();
            await loadGroups();
            await loadNotifications();
            await loadVIPData();
            renderSidebar();
            renderEffectExpiry();
        }, 30000);

        try {
            await API.updateMission(currentUser.username, 'login');
        } catch (e) {}

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                notificationCount = 0;
                document.title = originalTitle;
                if (currentChat?.id) {
                    const chatId = getChatId(currentChat.type, currentChat.id);
                    delete unreadCounts[chatId];
                    renderSidebar();
                }
                try {
                    API.updateMission(currentUser.username, 'login');
                } catch (e) {}
            }
        });

        setInterval(() => {
            if (currentUser && currentUser.seasonEffectsExpiry) {
                let hasExpired = false;
                Object.keys(currentUser.seasonEffectsExpiry).forEach(key => {
                    if (isEffectExpired(key)) {
                        hasExpired = true;
                        const effectInfo = ALL_EFFECTS[key];
                        const effectLabel = effectInfo ? t(effectInfo.label) : key;
                        showToast('warning', t('toast.effect_expired', { effect: effectLabel }));
                    }
                });
                if (hasExpired) {
                    refreshSessionData();
                }
            }
        }, 60000);

    } catch (e) {
        console.error('Load user data error:', e);
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        showToast('error', t('toast.loading_error') + e.message);
    }
}

// ============================================================
// INIT
// ============================================================
loadUserData();