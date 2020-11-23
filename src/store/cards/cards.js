const mockData = [
  {
    'width': 300,
    'height': 100,
    'zIndex': 1,
    'text': 'Lorem ipsum',
    'x': 20,
    'y': 20,
    'id': 0,
  },
  {
    'width': 300,
    'height': 100,
    'zIndex': 1,
    'text': 'Lorem ipsum',
    'x': 200,
    'y': 200,
    'id': 1,
  },
  {
    'width': 300,
    'height': 100,
    'zIndex': 2,
    'text': 'Lorem ipsum',
    'x': 300,
    'y': 500,
    'id': 2,
  },
  {
    'width': 300,
    'height': 100,
    'zIndex': 3,
    'x': 500,
    'y': 350,
    'id': 3,
  }
];

// initial state
const state = () => ({
  cards: [],
  deletedCards: []
});

// getters
const getters = {
  getCards: (state) => state.cards,
};

// mutations
const mutations = {
  setCards: (state, payload) => {
    state.cards = payload;
  },
  updatePosition: (state, { x, y, card }) => {
    const foundCard = state.cards.find(item => item.id === card.id);
    foundCard.x = x;
    foundCard.y = y;
  },
  updateSize: (state, { width, height, x, y, card }) => {
    const foundCard = state.cards.find(item => item.id === card.id);
    foundCard.width = width;
    foundCard.height = height;
    foundCard.x = x;
    foundCard.y = y;
  },
  bringForward: (state, { card }) => {
    const foundCardIndex = state.cards.findIndex(item => item.id === card.id);
    const [ foundCard ] = state.cards.splice(foundCardIndex, 1);
    state.cards.sort((a, b) => {
      return a - b;
    });
    let lastIndex = 1;
    state.cards = state.cards.map(item => {
      if (lastIndex < item.zIndex) {
        lastIndex++;
        item.zIndex = lastIndex;
      }
      return item;
    })
    foundCard.zIndex = lastIndex + 1;
    state.cards.push(foundCard);
  },
  deleteCard: (state, { card }) => {
    const foundCardIndex = state.cards.findIndex(item => item.id === card.id);
    const [ deletedCard ] = state.cards.splice(foundCardIndex, 1);
    state.deletedCards.push(deletedCard);
  },
  bringBack: (state, { x, y, height, width }) => {
    let elemToAdd = state.deletedCards.pop();
    if (elemToAdd) {
      elemToAdd = { ...elemToAdd, x, y, width, height }
      state.cards.push(elemToAdd);
      let lastIndex = 1;
      state.cards = state.cards.map(item => {
        if (lastIndex < item.zIndex) {
          lastIndex++;
          item.zIndex = lastIndex;
        }
        return item;
      })
      elemToAdd.zIndex = lastIndex + 1;
    }
  },
};

// actions
const actions = {
  getCards: async ({ commit }) => {
    commit('setCards', mockData);
  },
  updatePosition: ({ commit }, payload) => {
    commit('updatePosition', payload);
  },
  updateSize: ({ commit }, payload) => {
    commit('updateSize', payload);
  },
  bringForward: ({ commit }, payload) => {
    commit('bringForward', payload);
  },
  deleteCard: ({ commit }, payload) => {
    commit('deleteCard', payload);
  },
  bringBack: ({ commit }, payload) => {
    commit('bringBack', payload);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
