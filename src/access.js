/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */

const Staff = 1;
const Admin = 2;
const SysAdmin = 3;
export default function access(initialState) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && (currentUser.userType === Admin || currentUser.userType === SysAdmin),
    canSysAdmin: currentUser && currentUser.userType === SysAdmin,
    canStaff:
      currentUser &&
      (currentUser.userType === Staff ||
        currentUser.userType === Admin ||
        currentUser.userType === SysAdmin),
  };
}
