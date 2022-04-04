export const setAll = (state, properties) => {
  const props = Object.keys(properties);
  props.forEach(key => {
    state[key] = properties[key];
  });
};

export const formatAddress = address => {
  return address?.slice(0, 5) + "..." + address?.slice(address?.length - 5, address?.length);
};
