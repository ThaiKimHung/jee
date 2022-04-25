import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewPropTypes } from 'react-native';
import { horizontal, vertical } from '../../themes';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    marginVertical: vertical.xxSmall,
    justifyContent: 'center',
    bottom: 5,
    width: '100%',
  },
  pagination: {
    width: horizontal.xSmall,
    height: horizontal.xSmall,
    borderRadius: horizontal.xSmall,
    marginHorizontal: horizontal.xSmall,
  },
});

const Pagination = ({
  size,
  paginationIndex,
  scrollToIndex,
  paginationDefaultColor,
  paginationActiveColor,
  paginationStyle,
  paginationStyleItem,
}) => {
  // if (size < 3) {
  //   size = 3
  // }
  return (
    <View style={[styles.container, paginationStyle]}>
      {Array.from({ length: size }).map((_, index) => (
        <TouchableOpacity
          style={[
            styles.pagination,
            paginationStyleItem,
            paginationIndex === index
              ? { backgroundColor: paginationActiveColor }
              : { backgroundColor: paginationDefaultColor },
          ]}
          key={index}
        // onPress={() => scrollToIndex({ index })}
        />
      ))}
    </View>
  );
};
Pagination.propTypes = {
  scrollToIndex: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  paginationIndex: PropTypes.number,
  paginationActiveColor: PropTypes.string,
  paginationDefaultColor: PropTypes.string,
  paginationStyle: ViewPropTypes.style,
  paginationStyleItem: ViewPropTypes.style,
};
Pagination.defaultProps = {
  paginationIndex: 0,
  paginationActiveColor: '#d4d4d4',
  paginationDefaultColor: "#f0f0f0",
  paginationStyle: {},
  paginationStyleItem: {},
};

export default Pagination;
