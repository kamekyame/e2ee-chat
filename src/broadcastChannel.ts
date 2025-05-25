const isBuildMode = Deno.args.includes("build");

export function getBroadcastChannel(): BroadcastChannel | undefined {
  if (isBuildMode) {
    return undefined;
  } else {
    return new BroadcastChannel("message_channel");
  }
}
