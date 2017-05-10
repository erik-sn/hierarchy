[![Build Status](https://travis-ci.org/erik-sn/hierarchy.svg?branch=master)](https://travis-ci.org/erik-sn/hierarchy)
[![codecov](https://codecov.io/gh/erik-sn/hierarchy/branch/master/graph/badge.svg)](https://codecov.io/gh/erik-sn/hierarchy)

# Hierarchy

#### Application Template for Manufacturing Dashboards


This application is designed to provide a framework to build
and deploy dashboards and analytical tools for a manufacturing
environment.

The core of this are "modules", where each module is a small
app or display that is assigned to a part of your company hierarchy.

For example a "Site" may have three "departments", all of which have
two "machines". Modules can be built externally and then loaded
into any of these tiers. The built-in admin interface allows
for these to be built easily and remain flexible.

### Client Side

The client for this application is written in React.js, Redux, TypeScript,
and ImmutableJS. In general any "data" calls are kept in the immutable
space for performant updates.

### Server Side

The server is built using Django & Django Rest Framework. This
allows for a flexible, highly tested API. Database configuration, authentication
and permissions are all customizable to user needs.
