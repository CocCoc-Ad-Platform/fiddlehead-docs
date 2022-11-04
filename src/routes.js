import contents from './contents.scandir';
import {NotFound} from './pages/not-found/NotFound';
import {createArticle} from './pages/article/createArticle';

let stripFilenameNotations = (filename) => filename.replace(/(^\d+\.)/g, '');

let stripPathnameNotations = (pathname) => pathname.split('/').map(
    fname => stripFilenameNotations(fname)
).join('/');

let isFileItem = (item) => typeof item === 'string';

let isHomepageFilename = (filename) => /^0+\./.test(filename);

let contentRoutes = [];
let contentNavItems = [];

let walk = (dirItem, navItems) => {
    if (isFileItem(dirItem)) {
        return;
    }
    
    let [pathname, dirChildren] = dirItem;
    let filename = pathname.split('/').pop();
    
    let publicPath = '/' + stripPathnameNotations(pathname);
    if (isHomepageFilename(filename)) {
        publicPath = '/';
    }

    let hasTarget = false;
    
    if (dirChildren.some(isFileItem)) {
        contentRoutes.push({
            path: publicPath,
            Component: createArticle(pathname),
        });
        hasTarget = true;
    }
    
    let label = stripFilenameNotations(filename).replace(/\-/g, ' ');
    let navChildren = [];
    
    navItems.push({
        path: publicPath,
        label: label,
        children: navChildren,
        hasTarget: hasTarget,
    });

    dirChildren.forEach(child => {
        walk(child, navChildren);
    });
};

contents.forEach(item => {
    walk(item, contentNavItems);
});

export let routes = [
    ...contentRoutes,
    {
        path: '*',
        Component: NotFound
    }
];

export let navItems = [
    ...contentNavItems,
];
