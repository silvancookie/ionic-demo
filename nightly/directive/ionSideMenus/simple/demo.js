var DEMOS = [
  {
    "module": "checkboxSimple",
    "name": "simple",
    "docName": "ionCheckbox",
    "href": "/nightly/directive/ionCheckbox/simple",
    "javascript": {
      "path": "nightly/directive/ionCheckbox/simple/javascript.js",
      "content": "var app = angular.module('checkboxSimple', ['ionic']);\napp.controller('CheckboxSimpleCtrl', function($scope) {\n  $scope.pizza = {\n    pepperoni: true,\n    sausage: false,\n    anchovies: true,\n    jalapenos: false\n  };\n\n  $scope.toppings = function() {\n    var toppings = Object.keys($scope.pizza).filter(function(flavor) {\n      return $scope.pizza[flavor];\n    });\n    if (toppings.length > 1) {\n      toppings[toppings.length - 1] = 'and ' + toppings[toppings.length - 1];\n    }\n    if (toppings.length > 2) {\n      return toppings.join(', ');\n    } else if (toppings.length) {\n      return toppings.join(' ');\n    } else {\n      return 'nothing';\n    }\n  };\n});"
    },
    "html": {
      "path": "nightly/directive/ionCheckbox/simple/html.html",
      "content": "<ion-header-bar class=\"bar-positive\">\n  <h1 class=\"title\">\n    Checkbox: Simple Usage\n  </h1>\n</ion-header-bar>\n<ion-content ng-controller=\"CheckboxSimpleCtrl\" class=\"padding\">\n  <h3>Your pizza has {{toppings()}}!</h3>\n  <ion-checkbox ng-model=\"pizza.pepperoni\">\n    Pepperoni?\n  </ion-checkbox>\n  <ion-checkbox ng-model=\"pizza.sausage\">\n    Sausage?\n  </ion-checkbox>\n  <ion-checkbox ng-model=\"pizza.anchovies\">\n    Jalapeno?\n  </ion-checkbox>\n  <ion-checkbox ng-model=\"pizza.jalapenos\">\n    Anchovies?\n  </ion-checkbox>\n</ion-content>"
    }
  },
  {
    "module": "collectionRepeatContacts",
    "name": "contacts",
    "docName": "collectionRepeat",
    "href": "/nightly/directive/collectionRepeat/contacts",
    "javascript": {
      "path": "nightly/directive/collectionRepeat/contacts/javascript.js",
      "content": "angular.module('collectionRepeatContacts', ['ionic'])\n.controller('ContactsCtrl', function($scope, $ionicScrollDelegate, $http, $ionicLoading) {\n  var contacts = $scope.contacts = [];\n  var currentCharCode = 'A'.charCodeAt(0) - 1;\n\n  $ionicLoading.show({\n    template: 'Fetching Contacts...'\n  });\n\n  $http.get('/contacts.json').then(function(response) {\n    $ionicLoading.hide();\n    response.data.sort(function(a, b) {\n      return a.last_name > b.last_name ? 1 : -1;\n    })\n    .forEach(function(person) {\n      //Get the first letter of the last name, and if the last name changes\n      //put the letter in the array\n      var personCharCode = person.last_name.toUpperCase().charCodeAt(0);\n      //We may jump two letters, be sure to put both in\n      //(eg if we jump from Adam Bradley to Bob Doe, add both C and D)\n      var difference = personCharCode - currentCharCode;\n      for (var i = 1; i <= difference; i++) {\n        addLetter(currentCharCode + i);\n      }\n      currentCharCode = personCharCode;\n      contacts.push(person);\n    });\n\n    //If names ended before Z, add everything up to Z\n    for (var i = currentCharCode + 1; i <= 'Z'.charCodeAt(0); i++) {\n      addLetter(i);\n    }\n  });\n\n  function addLetter(code) {\n    var letter = String.fromCharCode(code);\n    contacts.push({\n      isLetter: true,\n      letter: letter\n    });\n  }\n\n  //Letters are shorter, everything else is 100 pixels\n  $scope.getItemHeight = function(item) {\n    return item.isLetter ? 40 : 100;\n  };\n\n  $scope.scrollBottom = function() {\n    $ionicScrollDelegate.scrollBottom(true);\n  };\n\n  $scope.scrollTop = function() {\n    $ionicScrollDelegate.scrollTop();\n  };\n\n  var letterHasMatch = {};\n  $scope.getContacts = function() {\n    letterHasMatch = {};\n    //Filter contacts by $scope.search.\n    //Additionally, filter letters so that they only show if there\n    //is one or more matching contact\n    return contacts.filter(function(item) {\n      var itemDoesMatch = !$scope.search || item.isLetter ||\n        item.first_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 ||\n        item.last_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;\n\n      //Mark this person's last name letter as 'has a match'\n      if (!item.isLetter && itemDoesMatch) {\n        var letter = item.last_name.charAt(0).toUpperCase();\n        letterHasMatch[letter] = true;\n      }\n\n      return itemDoesMatch;\n    }).filter(function(item) {\n      //Finally, re-filter all of the letters and take out ones that don't\n      //have a match\n      if (item.isLetter && !letterHasMatch[item.letter]) {\n        return false;\n      }\n      return true;\n    });\n  };\n\n  $scope.clearSearch = function() {\n    $scope.search = '';\n  };\n});"
    },
    "html": {
      "path": "nightly/directive/collectionRepeat/contacts/html.html",
      "content": "<div ng-controller=\"ContactsCtrl\">\n  <ion-header-bar class=\"bar-positive\">\n    <h1 class=\"title\">1000 Contacts</h1>\n    <div class=\"button\" ng-click=\"scrollBottom()\">\n      Bottom\n    </div>\n  </ion-header-bar>\n  <ion-header-bar class=\"bar-light bar-subheader\">\n    <input type=\"search\"\n      placeholder=\"Filter contacts...\"\n      ng-model=\"search\"\n      ng-change=\"scrollTop()\">\n    <button ng-if=\"search.length\"\n      class=\"button button-icon ion-android-close input-button\"\n      ng-click=\"clearSearch()\">\n    </button>\n  </ion-header-bar>\n  <ion-content>\n    <div class=\"list\">\n      <a class=\"item contact-item\"\n        collection-repeat=\"item in getContacts()\"\n        collection-item-height=\"getItemHeight(item)\"\n        collection-item-width=\"100 + '%'\"\n        ng-style=\"{'line-height': getItemHeight(item) + 'px'}\"\n        ng-class=\"{'item-divider': item.isLetter}\">\n        <img ng-if=\"!item.isLetter\" ng-src=\"http://placekitten.com/60/{{55 + ($index % 10)}}\">\n        {{item.letter || (item.first_name+' '+item.last_name)}}\n      </a>\n    </div>\n  </ion-content>\n</div>"
    },
    "css": {
      "path": "nightly/directive/collectionRepeat/contacts/css.css",
      "content": ".button.button-icon.input-button {\n  position: absolute;\n  right: 0;\n  top: 5px;\n  color: #bbb;\n}\n.list .item.contact-item img {\n  height: 60px;\n  width: 60px;\n  float: left;\n  margin-top: 20px;\n  margin-right: 10px;\n}\n.list .item.contact-item {\n  left: 0;\n  right: 0;\n  padding-top: 0;\n  padding-bottom: 0;\n}"
    }
  },
  {
    "module": "headerBarSimple",
    "name": "simple",
    "docName": "ionHeaderBar",
    "href": "/nightly/directive/ionHeaderBar/simple",
    "javascript": {
      "path": "nightly/directive/ionHeaderBar/simple/javascript.js",
      "content": "angular.module('headerBarSimple', ['ionic'])\n.controller('HeaderBarSimpleCtrl', function($scope) {\n  $scope.data = {\n    isSubheader: false,\n    isShown: true\n  };\n  $scope.items = [];\n  for (var i = 0; i < 20; i++) {\n    $scope.items.push('Item ' + i);\n  }\n});"
    },
    "html": {
      "path": "nightly/directive/ionHeaderBar/simple/html.html",
      "content": "<div ng-controller=\"HeaderBarSimpleCtrl\">\n  <ion-header-bar class=\"bar-positive\"\n    ng-class=\"{'bar-subheader': data.isSubheader}\"\n    ng-show=\"data.isShown\">\n    <h1 class=\"title\">Tap Me to Scroll Top</h1>\n  </ion-header-bar>\n  <ion-content>\n    <ion-toggle ng-model=\"data.isSubheader\">\n      Make it a Subheader?\n    </ion-toggle>\n    <ion-toggle ng-model=\"data.isShown\">\n      Show it?\n    </ion-toggle>\n    <div class=\"list\">\n      <div class=\"item\" ng-repeat=\"item in items\">\n        {{item}}\n      </div>\n    </div>\n  </ion-content>\n</div>"
    }
  },
  {
    "module": "footerBarSimple",
    "name": "simple",
    "docName": "ionFooterBar",
    "href": "/nightly/directive/ionFooterBar/simple",
    "javascript": {
      "path": "nightly/directive/ionFooterBar/simple/javascript.js",
      "content": "angular.module('footerBarSimple', ['ionic'])\n.controller('FooterBarSimpleCtrl', function($scope) {\n  $scope.data = {\n    isSubfooter: false,\n    isShown: true\n  };\n\n  $scope.items = [];\n  for (var i = 0; i < 20; i++) {\n    $scope.items.push('Item ' + i);\n  }\n});"
    },
    "html": {
      "path": "nightly/directive/ionFooterBar/simple/html.html",
      "content": "<div ng-controller=\"FooterBarSimpleCtrl\">\n  <ion-footer-bar class=\"bar-assertive\"\n      ng-class=\"{'bar-subfooter': data.isSubfooter}\"\n      ng-show=\"data.isShown\">\n    <h1 class=\"title\">Footer</h1>\n  </ion-footer-bar>\n  <ion-content>\n    <ion-toggle ng-model=\"data.isSubfooter\">\n      Make it a Subfooter?\n    </ion-toggle>\n    <ion-toggle ng-model=\"data.isShown\">\n      Show it?\n    </ion-toggle>\n    <div class=\"list\">\n      <div class=\"item\" ng-repeat=\"item in items\">\n        {{item}}\n      </div>\n    </div>\n  </ion-content>\n</div>"
    }
  },
  {
    "module": "infiniteScrollForever",
    "name": "forever",
    "docName": "ionInfiniteScroll",
    "href": "/nightly/directive/ionInfiniteScroll/forever",
    "javascript": {
      "path": "nightly/directive/ionInfiniteScroll/forever/javascript.js",
      "content": "angular.module('infiniteScrollForever', ['ionic'])\n.controller('ForeverCtrl', function($scope, $timeout) {\n  $scope.items = [];\n  for (var i = 0; i < 20; i++) {\n    $scope.items.push(i);\n  }\n\n  //Load more after 1 second delay\n  $scope.loadMoreItems = function() {\n    $timeout(function() {\n      var i = $scope.items.length;\n      var j = $scope.items.length + 5;\n      for (; i < j; i++) {\n        $scope.items.push('Item ' + i);\n      }\n      $scope.$broadcast('scroll.infiniteScrollComplete');\n    }, 1000);\n  };\n});"
    },
    "html": {
      "path": "nightly/directive/ionInfiniteScroll/forever/html.html",
      "content": "<ion-header-bar>\n  <h1 class=\"title\">Scroll Down to Load More</h1>\n</ion-header-bar>\n<ion-content ng-controller=\"ForeverCtrl\">\n  <div class=\"list\">\n    <div class=\"item\" ng-repeat=\"item in items\">\n      {{item}}\n    </div>\n  </div>\n\n  <ion-infinite-scroll on-infinite=\"loadMoreItems()\"\n    icon=\"ion-loading-c\">\n  </ion-infinite-scroll>\n</ion-content>"
    }
  },
  {
    "module": "listEverything",
    "name": "reorderDelete",
    "docName": "ionList",
    "href": "/nightly/directive/ionList/reorderDelete",
    "javascript": {
      "path": "nightly/directive/ionList/reorderDelete/javascript.js",
      "content": "angular.module('listEverything', ['ionic'])\n.controller('ListCtrl', function($scope, $ionicPopup) {\n  $scope.data = {\n    showReorder: false,\n    showDelete: false\n  };\n\n  $scope.items = [];\n  for (var i = 0; i < 20; i++) {\n    $scope.items.push(i);\n  }\n\n  $scope.toggleDelete = function() {\n    $scope.data.showReorder = false;\n    $scope.data.showDelete = !$scope.data.showDelete;\n  };\n  $scope.toggleReorder = function() {\n    $scope.data.showDelete = false;\n    $scope.data.showReorder = !$scope.data.showReorder;\n  };\n\n  $scope.share = function(item) {\n    alert('Sharing ' + item);\n  };\n  $scope.edit = function(item) {\n    alert('Editing ' + item);\n  };\n\n  $scope.reorderItem = function(item, fromIndex, toIndex) {\n    $scope.items.splice(fromIndex, 1)\n    $scope.items.splice(toIndex, 0, item)\n  };\n});"
    },
    "html": {
      "path": "nightly/directive/ionList/reorderDelete/html.html",
      "content": "<div ng-controller=\"ListCtrl\">\n  <ion-header-bar class=\"bar-positive\">\n    <a class=\"button\" ng-click=\"toggleDelete()\">\n      Delete\n    </a>\n    <h1 class=\"title\">List</h1>\n    <a class=\"button\" ng-click=\"toggleReorder()\">\n      Reorder\n    </a>\n  </ion-header-bar>\n  <ion-content>\n    <ion-list show-delete=\"data.showDelete\"\n              show-reorder=\"data.showReorder\">\n      <ion-item ng-repeat=\"item in items\"\n                class=\"item-thumbnail-left\">\n\n        <img ng-src=\"http://placekitten.com/{{60+$index}}/{{61+2*$index}}\">\n        <h2>Item {{item}}</h2>\n        <p>Here's an item description.</p>\n        <ion-option-button class=\"button-positive\"\n                           ng-click=\"share(item)\">\n          Share\n        </ion-option-button>\n        <ion-option-button class=\"button-info\"\n                           ng-click=\"edit(item)\">\n          Edit\n        </ion-option-button>\n        <ion-delete-button class=\"ion-minus-circled\"\n                           ng-click=\"items.splice($index, 1)\">\n        </ion-delete-button>\n        <ion-reorder-button class=\"ion-navicon\"\n                            on-reorder=\"reorderItem(item, $fromIndex, $toIndex)\">\n        </ion-reorder-button>\n\n      </ion-item>\n    </ion-list>\n  </ion-content>\n</div>"
    }
  },
  {
    "module": "listAnimated",
    "name": "animated",
    "docName": "ionList",
    "href": "/nightly/directive/ionList/animated",
    "javascript": {
      "path": "nightly/directive/ionList/animated/javascript.js",
      "content": "angular.module('listAnimated', ['ionic'])\n.controller('AnimatedListCtrl', function($scope, $timeout) {\n  var nextItem = 0;\n  $scope.items = [];\n  for (var i=0; i < 5; i++) {\n    $scope.items.push('Item ' + (nextItem++));\n  }\n\n  $scope.addItem = function(atIndex) {\n    $scope.items.splice(atIndex + 1, 0, 'Item ' + nextItem);\n    nextItem++;\n  };\n});"
    },
    "html": {
      "path": "nightly/directive/ionList/animated/html.html",
      "content": "<div ng-controller=\"AnimatedListCtrl\">\n  <ion-header-bar class=\"bar-positive\">\n    <h1 class=\"title\">Animated List</h1>\n  </ion-header-bar>\n  <ion-content>\n    <ion-list show-delete=\"showDelete\">\n\n      <ion-item class=\"animated-item\"\n                ng-repeat=\"item in items\">\n        {{item}}\n        <div class=\"item-note\">\n          <a class=\"button button-small\"\n             ng-click=\"addItem($index)\">\n             Add\n          </a>\n          <a class=\"button button-small\"\n             ng-click=\"items.splice($index, 1)\">\n            Remove\n          </a>\n        </div>\n      </ion-item>\n\n    </ion-list>\n  </ion-content>\n</div>"
    },
    "css": {
      "path": "nightly/directive/ionList/animated/css.css",
      "content": ".animated-item .item-note .button {\n  margin-top: 10px;\n}\n.animated-item {\n  line-height: 52px;\n  padding-top: 0;\n  padding-bottom: 0;\n  -webkit-transition: all 0.15s linear;\n  -moz-transition: all 0.15s linear;\n  transition: all 0.15s linear;\n}\n.animated-item.ng-leave.ng-leave-active,\n.animated-item.ng-enter {\n  opacity: 0;\n  max-height: 0;\n}\n.animated-item.ng-leave,\n.animated-item.ng-enter.ng-enter-active {\n  opacity: 1;\n  max-height: 52px;\n}"
    }
  },
  {
    "module": "refresherList",
    "name": "withAList",
    "docName": "ionRefresher",
    "href": "/nightly/directive/ionRefresher/withAList",
    "javascript": {
      "path": "nightly/directive/ionRefresher/withAList/javascript.js",
      "content": "angular.module('refresherList', ['ionic'])\n.controller('RefresherCtrl', function($scope, $timeout) {\n  $scope.items = ['Item 1', 'Item 2', 'Item 3'];\n\n  $scope.doRefresh = function() {\n    $timeout(function() {\n      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);\n      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);\n      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);\n      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);\n      $scope.$broadcast('scroll.refreshComplete');\n    }, 1000);\n  };\n});"
    },
    "html": {
      "path": "nightly/directive/ionRefresher/withAList/html.html",
      "content": "<ion-header-bar class=\"bar-positive\">\n  <h1 class=\"title\">Refresher</h1>\n</ion-header-bar>\n\n<ion-content ng-controller=\"RefresherCtrl\">\n\n  <ion-refresher on-refresh=\"doRefresh()\" \n                 pulling-text=\"Pull to refresh...\" \n                 refreshing-text=\"Refreshing!\" \n                 refreshing-icon=\"ion-loading-c\">\n  </ion-refresher>\n\n  <ion-list>\n    <ion-item ng-repeat=\"item in items\">{{item}}</ion-item>\n  </ion-list>\n\n</ion-content>"
    }
  },
  {
    "module": "sideMenusSimple",
    "name": "simple",
    "docName": "ionSideMenus",
    "href": "/nightly/directive/ionSideMenus/simple",
    "javascript": {
      "path": "nightly/directive/ionSideMenus/simple/javascript.js",
      "content": "var app = angular.module('sideMenusSimple', ['ionic']);\napp.controller('SideMenusSimpleCtrl', function($scope, $ionicSideMenuDelegate) {\n\n  $scope.toggleLeft = function() {\n    $ionicSideMenuDelegate.toggleLeft();\n  };\n\n});"
    },
    "html": {
      "path": "nightly/directive/ionSideMenus/simple/html.html",
      "content": "<ion-view title=\"Side Menus Simple\" ng-controller=\"SideMenusSimpleCtrl\">\n  <ion-side-menus>\n\n    <ion-side-menu-content>\n      <ion-header-bar class=\"bar-positive\">\n        <div class=\"buttons\">\n          <div class=\"button button-clear\" ng-click=\"toggleLeft()\">\n            <i class=\"icon ion-navicon\"></i>\n          </div>\n        </div>\n      </ion-header-bar>\n      <ion-content class=\"padding\">\n        <p>Slide the content or press the button on the header to open a side menu.</p>\n      </ion-content>\n    </ion-side-menu-content>\n\n    <ion-side-menu side=\"left\">\n      <ion-header-bar class=\"bar-positive\">\n      </ion-header-bar>\n      <ion-content>\n        <a class=\"item\" ng-click=\"toggleLeft()\">\n          Close Menu\n        </a>\n      </ion-content>\n    </ion-side-menu>\n\n  </ion-side-menus>\n</ion-view>"
    }
  },
  {
    "module": "tabsAndNavigation",
    "name": "navigation",
    "docName": "ionTabs",
    "href": "/nightly/directive/ionTabs/navigation",
    "javascript": {
      "path": "nightly/directive/ionTabs/navigation/javascript.js",
      "content": "angular.module('tabsAndNavigation', ['ionic'])\n.config(function ($stateProvider, $urlRouterProvider) {\n\n  $stateProvider\n    .state('tabs', {\n      url: \"/tab\",\n      abstract: true,\n      templateUrl: \"tabs.html\"\n    })\n    .state('tabs.home', {\n      url: \"/home\",\n      views: {\n        'home-tab': {\n          templateUrl: \"home.html\",\n          controller: 'HomeTabCtrl'\n        }\n      }\n    })\n    .state('tabs.facts', {\n      url: \"/facts\",\n      views: {\n        'home-tab': {\n          templateUrl: \"facts.html\"\n        }\n      }\n    })\n    .state('tabs.facts2', {\n      url: \"/facts2\",\n      views: {\n        'home-tab': {\n          templateUrl: \"facts2.html\"\n        }\n      }\n    })\n    .state('tabs.about', {\n      url: \"/about\",\n      views: {\n        'about-tab': {\n          templateUrl: \"about.html\"\n        }\n      }\n    })\n    .state('tabs.navstack', {\n      url: \"/navstack\",\n      views: {\n        'about-tab': {\n          templateUrl: \"nav-stack.html\"\n        }\n      }\n    })\n    .state('tabs.contact', {\n      url: \"/contact\",\n      views: {\n        'contact-tab': {\n          templateUrl: \"contact.html\"\n        }\n      }\n    });\n\n\n  $urlRouterProvider.otherwise(\"/tab/home\");\n\n})\n\n.controller('HomeTabCtrl', function ($scope) {\n  console.log('We have arrived at HomeTabCtrl.');\n});"
    },
    "html": {
      "path": "nightly/directive/ionTabs/navigation/html.html",
      "content": "<ion-nav-bar class=\"nav-title-slide-ios7 bar-positive\">\n  <ion-nav-back-button class=\"button-icon ion-arrow-left-c\">\n  </ion-nav-back-button>\n</ion-nav-bar>\n\n<ion-nav-view animation=\"slide-left-right\"></ion-nav-view>\n\n<script id=\"tabs.html\" type=\"text/ng-template\">\n  <ion-tabs class=\"tabs-icon-top tabs-positive\">\n\n    <ion-tab title=\"Home\" icon=\"ion-home\" href=\"#/tab/home\">\n      <ion-nav-view name=\"home-tab\"></ion-nav-view>\n    </ion-tab>\n\n    <ion-tab title=\"About\" icon=\"ion-ios7-information\" href=\"#/tab/about\">\n      <ion-nav-view name=\"about-tab\"></ion-nav-view>\n    </ion-tab>\n\n    <ion-tab title=\"Contact\" icon=\"ion-ios7-world\" ui-sref=\"tabs.contact\">\n      <ion-nav-view name=\"contact-tab\"></ion-nav-view>\n    </ion-tab>\n\n  </ion-tabs>\n</script>\n\n<script id=\"home.html\" type=\"text/ng-template\">\n  <ion-view title=\"Home\">\n    <ion-content class=\"padding\">\n      <p>Example of Ionic tabs. Navigate to each tab, and\n      navigate to child views of each tab and notice how\n      each tab has its own navigation history.</p>\n      <p>\n        <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/facts\">Scientific Facts</a>\n      </p>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script id=\"facts.html\" type=\"text/ng-template\">\n  <ion-view title=\"Facts\" class=\"padding\">\n    <ion-content>\n      <p>Banging your head against a wall uses 150 calories an hour.</p>\n      <p>Dogs have four toes on their hind feet, and five on their front feet.</p>\n      <p>The ant can lift 50 times its own weight, can pull 30 times its own weight and always falls over on its right side when intoxicated.</p>\n      <p>A cockroach will live nine days without it's head, before it starves to death.</p>\n      <p>Polar bears are left handed.</p>\n      <p>\n        <a class=\"button icon ion-home\" href=\"#/tab/home\"> Home</a>\n        <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/facts2\">More Facts</a>\n      </p>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script id=\"facts2.html\" type=\"text/ng-template\">\n  <ion-view title=\"Also Factual\">\n    <ion-content class=\"padding\">\n      <p>111,111,111 x 111,111,111 = 12,345,678,987,654,321</p>\n      <p>1 in every 4 Americans has appeared on T.V.</p>\n      <p>11% of the world is left-handed.</p>\n      <p>1 in 8 Americans has worked at a McDonalds restaurant.</p>\n      <p>$283,200 is the absolute highest amount of money you can win on Jeopardy.</p>\n      <p>101 Dalmatians, Peter Pan, Lady and the Tramp, and Mulan are the only Disney cartoons where both parents are present and don't die throughout the movie.</p>\n      <p>\n        <a class=\"button icon ion-home\" href=\"#/tab/home\"> Home</a>\n        <a class=\"button icon ion-chevron-left\" href=\"#/tab/facts\"> Scientific Facts</a>\n      </p>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script id=\"about.html\" type=\"text/ng-template\">\n  <ion-view title=\"About\">\n    <ion-content class=\"padding\">\n      <h3>Create hybrid mobile apps with the web technologies you love.</h3>\n      <p>Free and open source, Ionic offers a library of mobile-optimized HTML, CSS and JS components for building highly interactive apps.</p>\n      <p>Built with Sass and optimized for AngularJS.</p>\n      <p>\n        <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/navstack\">Tabs Nav Stack</a>\n      </p>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script id=\"nav-stack.html\" type=\"text/ng-template\">\n  <ion-view title=\"Tab Nav Stack\">\n    <ion-content class=\"padding\">\n      <p><img src=\"http://ionicframework.com/img/diagrams/tabs-nav-stack.png\" style=\"width:100%\"></p>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script id=\"contact.html\" type=\"text/ng-template\">\n  <ion-view title=\"Contact\">\n    <ion-content>\n      <p>@IonicFramework</p>\n      <p>@DriftyCo</p>\n    </ion-content>\n  </ion-view>\n</script>"
    }
  },
  {
    "module": "loadingThemAll",
    "name": "loadThemAll",
    "docName": "$ionicLoading",
    "href": "/nightly/service/$ionicLoading/loadThemAll",
    "javascript": {
      "path": "nightly/service/$ionicLoading/loadThemAll/javascript.js",
      "content": "angular.module('loadingThemAll', ['ionic'])\n.controller('LoadingCtrl', function($scope, $ionicLoading) {\n  $scope.loadingOptions = {\n    duration: 1000,\n    delay: 0,\n    template: '<i class=\"icon ion-loading-c\"></i>\\n<br/>\\nLoading...',\n    noBackdrop: false\n  };\n  $scope.showLoading = function() {\n    $ionicLoading.show($scope.loadingOptions);\n  };\n});"
    },
    "html": {
      "path": "nightly/service/$ionicLoading/loadThemAll/html.html",
      "content": "<div ng-controller=\"LoadingCtrl\">\n  <ion-header-bar class=\"bar-positive\">\n    <h1 class=\"title\">Loading Demo</h1>\n    <a class=\"button\" ng-click=\"showLoading()\">\n      <i class=\"icon ion-more\"></i> Load\n    </a>\n  </ion-header-bar>\n  <ion-content>\n    <div class=\"list\">\n      <label class=\"item item-input item-stacked-label\">\n        <span class=\"input-label\">Loading Duration (ms)</span>\n        <input type=\"number\" ng-model=\"loadingOptions.duration\">\n      </label>\n      <label class=\"item item-input item-stacked-label\">\n        <span class=\"input-label\">Loading Delay (ms)</span>\n        <input type=\"number\" ng-model=\"loadingOptions.delay\">\n      </label>\n      <label class=\"item item-input item-stacked-label\">\n        <span class=\"input-label\">Loading Template</span>\n        <textarea rows=\"3\" ng-model=\"loadingOptions.template\"></textarea>\n      </label>\n      <ion-toggle class=\"item item-toggle\"\n                  ng-model=\"loadingOptions.noBackdrop\">\n        Hide Backdrop?\n      </ion-toggle>\n    </div>\n  </ion-content>\n</div>"
    }
  }
];
var DEMO;

  DEMO = {
  "module": "sideMenusSimple",
  "name": "simple",
  "docName": "ionSideMenus",
  "href": "/nightly/directive/ionSideMenus/simple",
  "javascript": {
    "path": "nightly/directive/ionSideMenus/simple/javascript.js",
    "content": "var app = angular.module('sideMenusSimple', ['ionic']);\napp.controller('SideMenusSimpleCtrl', function($scope, $ionicSideMenuDelegate) {\n\n  $scope.toggleLeft = function() {\n    $ionicSideMenuDelegate.toggleLeft();\n  };\n\n});"
  },
  "html": {
    "path": "nightly/directive/ionSideMenus/simple/html.html",
    "content": "<ion-view title=\"Side Menus Simple\" ng-controller=\"SideMenusSimpleCtrl\">\n  <ion-side-menus>\n\n    <ion-side-menu-content>\n      <ion-header-bar class=\"bar-positive\">\n        <div class=\"buttons\">\n          <div class=\"button button-clear\" ng-click=\"toggleLeft()\">\n            <i class=\"icon ion-navicon\"></i>\n          </div>\n        </div>\n      </ion-header-bar>\n      <ion-content class=\"padding\">\n        <p>Slide the content or press the button on the header to open a side menu.</p>\n      </ion-content>\n    </ion-side-menu-content>\n\n    <ion-side-menu side=\"left\">\n      <ion-header-bar class=\"bar-positive\">\n      </ion-header-bar>\n      <ion-content>\n        <a class=\"item\" ng-click=\"toggleLeft()\">\n          Close Menu\n        </a>\n      </ion-content>\n    </ion-side-menu>\n\n  </ion-side-menus>\n</ion-view>"
  }
};


angular.module('sideMenusSimple'
  )
.controller('IonicDemoCtrl', function($scope, $ionicModal, $ionicLoading) {
  $scope.$demos = DEMOS;

  
    $scope.$demo = DEMO;
    $ionicModal.fromTemplateUrl('ionic-demo-modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.$demoModal = modal;
    });

    //don't try this at home
    ionic.onGesture('dragup', function(e) {
      if (e.gesture.distance > 35 && !$scope.$demoModal.isShown()) {
        $scope.$apply(function(e) {
          $scope.$demoModal.show();
        });
      }
    }, document.querySelector('.demo-footer'));

    $scope.demoScratch = function(demo) {
      var form = angular.element('<form method="POST" action="http://scratch.ionicsdk.com/embed">');

      var htmlInput = angular.element('<textarea type="text" name="html">')
      .val(['<html ng-app="sideMenusSimple">',
           '<head>',
           '  <meta charset="utf-8">',
           '  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">',
           '  <link rel="stylesheet" href="http://code.ionicframework.com/nightly/css/ionic.css">',
           '  <script src="http://code.ionicframework.com/nightly/js/ionic.bundle.js"></script>',
           '</head>',
           '<body>',
           (demo.html && demo.html.content || ''),
           '</body>',
           '</html>'].join('\n'));

           var cssInput = angular.element('<textarea type="text" name="css">')
           .val(demo.css && demo.css.content || '');

           var jsInput = angular.element('<textarea type="text" name="js">')
           .val(demo.javascript && demo.javascript.content || '');

           form
           .css('display','none')
           .append(htmlInput)
           .append(cssInput)
           .append(jsInput);

           document.body.appendChild(form[0]);
           form[0].submit();

           $ionicLoading.show({
             template: 'Opening in Scratchpad...'
           });
    };
    
})
.filter('humanize', function() {
  return function(input) {
    return input.charAt(0).toUpperCase() + 
      input.substring(1).replace(/[A-Z]/g, function(match, i) {
        return ' ' + match.toUpperCase();
      });
  };
});
