export function parseUsername(argv) {
  const arg = argv.find((a) => a.startsWith('--username='));
  if (!arg) return null;
  const value = arg.split('=')[1];
  return value && value.trim().length > 0 ? value.trim() : null;
}


