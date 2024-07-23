import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
  },
  description: {
    margin: 5,
  },
  descriptionText: {
    fontSize: 18,
  },
  mapBox: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
  button: {
    width: '20%',
    marginTop: 10,
  },
  space: {
    padding: 3,
  },
  clearScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  catClear: {
    width: 200,
    height: 200,
  },
  clearText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  resultBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  resultLeft: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 40,
  },
  resultIndex: {
    marginRight: 10,
  },
  catResult: {
    width: 80,
    height: 80,
  },
});
