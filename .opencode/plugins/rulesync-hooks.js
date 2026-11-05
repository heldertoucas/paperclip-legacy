export default {
  id: "rulesync-hooks",
  setup: async (ctx) => {
    const directory = ctx.location?.directory ?? process.cwd();
    const $ = new Bun.$.Shell();
    $.cwd(directory);

    const __rulesyncRegistrations = [];
    __rulesyncRegistrations.push(
      await ctx.session.hook("context", async (event) => {
        await $`python -m dev.cli session bootstrap --agent Antigravity --format antigravity`;
      }),
    );

    return async () => {
      await Promise.all(__rulesyncRegistrations.map((registration) => registration.dispose()));
    };
  },
};
