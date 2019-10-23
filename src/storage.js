let storage = {
  apiKey: 'a70dbfe19b800809dfdd3e89e8532c9e',
  token: localStorage.getItem('token') || null,
  username: localStorage.getItem('username') || null,
  admin: localStorage.getItem('admin') || null,
  pageTitlePostfix: ' — ' + document.title,
  listTypes: [
    {
      title: 'Your Requests',
      shortTitle: 'User Requests',
      query: 'user-requests',
      name: 'user-requests',
      type: 'user-requests',
      isProfileContent: true
      // isCategory: true,
    },
    {
      title: 'Requested Movies & Shows',
      shortTitle: 'Requested',
      query: 'requests',
      name: 'home-category',
      type: 'requests', // Maybe change to separate group
      isCategory: true,
      isProfileContent: true
    },
    {
      title: 'Upcoming Movies',
      shortTitle: 'Upcoming',
      query: 'upcoming',
      name: 'home-category',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Now Playing Movies',
      shortTitle: 'Now Playing',
      query: 'nowplaying',
      name: 'home-category',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Popular Movies',
      shortTitle: 'Popular',
      query: 'popular',
      name: 'home-category',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Search Results',
      query: 'search',
      isCategory: false
    },
    {
      title: 'Your Favorite Movies',
      query: 'favorite',
      isCategory: false
    }
  ],
  categories: {},
  // For Browser History
  backTitle: '',
  moviePath: '',
  createMoviePopup: false,
  moviePopupOnHistory: false
};

// Create categories titles
storage.listTypes.forEach(function(listType){
  storage.categories[listType.query] = listType.title;
});

export default storage;
