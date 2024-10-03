export function userHasAllAccess(privileges: string[] | undefined) {
  if (privileges) {
    return !!(
      privileges.includes('superAdmin') ||
      privileges.includes('betaUser') ||
      privileges.includes('allAccess')
    );
  }
  return false;
}
