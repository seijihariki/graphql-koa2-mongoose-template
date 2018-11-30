# Our base node image
FROM node:11.3-alpine AS base

## USER CONFIG
# Yarn or npm ?
ARG package_manager=yarn
ARG package_lock=yarn.lock

ENV PACK_MANAGER=${package_manager}
ENV LOCK_FILE=${package_lock}

# Create an environment variable for our default installation path
ARG project_root=/usr/src/api

ENV INSTALL_PATH=${project_root}

# Port
ARG port=3000

EXPOSE ${port}

## BUILD
# Set path as workdir
WORKDIR $INSTALL_PATH

###########################################################################
# Start development stage - basic node package installing and source copy #
###########################################################################
FROM base AS development

# We are in development
ENV NODE_ENV development

# Copy dependency files
COPY package.json ${LOCK_FILE} ./

# Install dependencies and devDependencies (NODE_ENV)
RUN ${PACK_MANAGER} install

# Copy remaining source code
COPY . .

# At this point, may mount . as volume

###########################################################################
# Start build stage - babel build                                         #
###########################################################################
FROM development AS build

# Build src to pure javascript
RUN ${PACK_MANAGER} run build

###########################################################################
# Production stage - setup for production                                 #
###########################################################################
FROM base as production

# From here on we are in production
ENV NODE_ENV production

# Copy relevant files
COPY --from=build ${INSTALL_PATH}/package.json ${INSTALL_PATH}/${LOCK_FILE} ./
COPY --from=build ${INSTALL_PATH}/dist/ ./dist

# Install producion-only dependencies
RUN ${PACK_MANAGER} install --production

# Remove lockfile
RUN rm ${INSTALL_PATH}/${LOCK_FILE}

# Start in production
CMD ${PACK_MANAGER} run start