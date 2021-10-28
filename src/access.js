/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */

const Staff = 1;
const Admin = 2;
const SysAdmin = 3;
export default function access(initialState) {
  const { currentUser } = initialState || {};
  return {
    canAdmin:
      currentUser && (currentUser.user_type === Admin || currentUser.user_type === SysAdmin),
    canSysAdmin: currentUser && currentUser.user_type === SysAdmin,
    canStaff:
      currentUser &&
      (currentUser.user_type === Staff ||
        currentUser.user_type === Admin ||
        currentUser.user_type === SysAdmin),
  };
}
