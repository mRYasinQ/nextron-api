import envSchema from '@/shared/schemas/env.schema';

const AppConfig = () => {
  const env = envSchema.parse(process.env);

  return {
    node_env: env.NODE_ENV,
    app: {
      url: env.APP_URL,
      port: env.APP_PORT,
      enable_swagger: env.ENABLE_SWAGGER,
    },
  };
};

export default AppConfig;
