function extractPathnameSegments(path) {
  const splitUrl = path.split('/');

  return {
    resource: splitUrl[1] || null,
    id: splitUrl[2] || null,
  };
}

function constructRouteFromSegments(pathSegments) {
  let pathname = '';

  if (pathSegments.resource) {
    pathname = pathname.concat(`/${pathSegments.resource}`);
  }

  if (pathSegments.id) {
    pathname = pathname.concat('/:id');
  }

  return pathname || '/';
}

export function getActivePathname() {
  return location.hash.replace('#', '') || '/';
}

// export function getActiveRoute() {
//   const pathname = getActivePathname();
//   const urlSegments = extractPathnameSegments(pathname);
//   return constructRouteFromSegments(urlSegments);
// }

export function parseActivePathname() {
  const pathname = getActivePathname();
  return extractPathnameSegments(pathname);
}

export function getRoute(pathname) {
  const urlSegments = extractPathnameSegments(pathname);
  return constructRouteFromSegments(urlSegments);
}

export function parsePathname(pathname) {
  return extractPathnameSegments(pathname);
}


// export function getRouteParams() {
//   const [ , id ] = (location.hash.slice(1).split('/'));
//   return { id };
// }

export function getActiveRoute() {
  const hash = location.hash.slice(1) || '/';
  const segments = extractSegments(hash);
  return buildRoute(segments);
}

export function getRouteParams() {
  const hash = location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);
  return { id: parts[1] || null };
}

function extractSegments(path) {
  const parts = path.split('/').filter(Boolean);
  return { resource: parts[0] || null, id: parts[1] || null };
}

function buildRoute({ resource, id }) {
  if (resource && id) return `/${resource}/:id`;
  if (resource) return `/${resource}`;
  return '/';
}