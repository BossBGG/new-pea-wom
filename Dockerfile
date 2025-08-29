ARG IMAGE_PREFIX
ARG PROXY_IMAGE_PREFIX
FROM ${IMAGE_PREFIX}/base:stable AS builder

# Accept build argument from the CI/CD
ARG NEXT_PUBLIC_APP_BASE_URL
# Set it as an environment variable
ENV NEXT_PUBLIC_APP_BASE_URL=${NEXT_PUBLIC_APP_BASE_URL}

# Change the following line according to your project structure
# USER for runtime must be number (Default: 65532)

USER root

# Ensure the latest code is copied into the builder stage
COPY . . 

# APK ADD ALREADY IN BASE IMAGE (but if not working, uncomment the line below)
# RUN apk add --no-cache git openssh=9.9_p1-r2

# Change package manager according to your needs
RUN npm run build
# RUN pnpm run build

####################
FROM ${PROXY_IMAGE_PREFIX}/node:20-alpine

WORKDIR /app

ENV NODE_ENV production

COPY --chown=65532:65532 --from=builder /app/public ./public

COPY --chown=65532:65532 --from=builder /app/.next ./.next

COPY --chown=65532:65532 --from=builder /app/node_modules ./node_modules

COPY --chown=65532:65532 --from=builder /app/package.json ./package.json

# Needed this if using Approach 1 (from README)
# COPY --chown=65532:65532 --from=builder /app/entrypoint.sh /app/entrypoint.sh
# RUN chmod +x /app/entrypoint.sh

RUN mkdir -p /app/.next/cache && chown -R 65532:65532 /app/.next

USER 65532

EXPOSE 3000

ENV PORT 3000

# Use this if using Approach 1 (from README)
# ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]

# Use this if using Approach 2 (from README)
CMD [ "npm", "run", "start" ]
# CMD [ "pnpm", "start" ]
