module.exports = {
  plugins: [
    require("precss"),
    require("postcss-preset-env")({
      stage: 0,
    }),
    require("cssnano")({
      preset: [
        "advanced",
        {
          discardComments: {
            removeAll: true,
          },
          reduceIdents: false,
        },
      ],
    }),
    require("postcss-reporter")({
      clearReportedMessages: true,
    }),
  ],
};
