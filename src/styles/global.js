import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
  header: {
    marginVertical: 15,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 30,
  },
  container: {flex: 1, padding: 12},
  title: {
    fontSize: 34,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  row: {flexDirection: 'row'},
  centeredRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
