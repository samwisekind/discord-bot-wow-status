# Install dependencies and bundle assets
FROM node:14-alpine AS build
WORKDIR /app
COPY . /app
RUN npm ci --unsafe-perm \
    && npm run build

# Clean build and run app
FROM build
RUN rm -rf ./tsconfig.json ./tsconfig.build.json ./src
RUN npm prune --production
CMD ["npm", "start"]
