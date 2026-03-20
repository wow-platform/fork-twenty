FROM node:24-alpine AS twenty-docs

WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .
COPY ./.yarnrc.yml .
COPY ./.yarn/releases /app/.yarn/releases
COPY ./.yarn/patches /app/.yarn/patches
COPY ./packages/twenty-shared/package.json /app/packages/twenty-shared/
COPY ./packages/twenty-docs/package.json /app/packages/twenty-docs/

RUN yarn

COPY ./packages/twenty-shared /app/packages/twenty-shared
COPY ./packages/twenty-docs /app/packages/twenty-docs

RUN yarn docs:generate-navigation-template && \
    yarn docs:generate && \
    yarn docs:generate-paths

LABEL org.opencontainers.image.source=https://github.com/twentyhq/twenty
LABEL org.opencontainers.image.description="Twenty CRM documentation site powered by Mintlify."

WORKDIR /app/packages/twenty-docs

EXPOSE 3000

CMD ["npx", "mintlify", "dev", "--host", "0.0.0.0", "--port", "3000"]
