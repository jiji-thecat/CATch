import * as React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Text, View, Button, Image, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { styles } from '../styles';
import MainMap from '../mainMap';
import { navigationRef, navigate } from '../navigation/RootNavigation';
import { RootStackParamList } from '../types';
import { store, RootState } from '../redux/store';
import { add } from '../redux/catSlice';

const playAgainTitle = 'Play Again';

const ResultComponent = () => {
  const result = useSelector((state: RootState) => state.catReducer);

  return result.map((value, index) => (
    <View style={styles.resultBox}>
      <View style={styles.resultLeft}>
        <Text style={styles.resultIndex}>{index + 1}</Text>
        <Image style={styles.catResult} source={{ uri: value.img }} />
      </View>
      <Text onPress={() => Linking.openURL(value.url)}>Street View</Text>
    </View>
  ));
};

const ResultScreen = () => {
  return (
    <Provider store={store}>
      <ResultComponent />
    </Provider>
  );
};

const ClearComponent = ({ route }: { route: any }) => {
  const { img, url } = route.params;

  const dispatch = useDispatch();
  dispatch(add({ img, url }));

  return (
    <View style={styles.clearScreen}>
      <Image style={styles.catClear} source={{ uri: img }} />
      <Text style={styles.clearText}>／YOU GOT ME!＼</Text>
    </View>
  );
};

const ClearScreen = ({ route }: { route: any }) => {
  return (
    <Provider store={store}>
      <ClearComponent route={route} />
    </Provider>
  );
};

const MapScreen = () => {
  return (
    <div id="parent">
      <div id="map"></div>
      <div id="streetview">
        <div id="markerDiv"></div>
      </div>
      <div id="result">CATCH!</div>
    </div>
  );
};

const App = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const [title, setTitle] = React.useState('Start Game');

  const onClear = React.useCallback(({ img, url }: { img: string; url: string }) => {
    navigate({ name: 'ClearScreen', params: { img, url } });
  }, []);

  const onPressPlay = React.useCallback(async () => {
    setTitle(playAgainTitle);

    const mainMap = new MainMap(onClear);
    await mainMap.init();
    mainMap.releaseCat();

    if (title === playAgainTitle) {
      navigate({ name: 'MapScreen', params: null });
    }
  }, [title]);

  const onPressResult = React.useCallback(() => {
    navigate({ name: 'ResultScreen', params: null });
  }, []);

  return (
    <View style={styles.box}>
      <View style={styles.description}>
        <Text style={styles.descriptionText}>1. Drag around the map on the left and find a suspicious marker.</Text>
        <Text style={styles.descriptionText}>2. Find the cat inside the street view map on the right.</Text>
      </View>
      <View style={styles.button}>
        <Button title={title} onPress={onPressPlay} />
        <View style={styles.space} />
        <Button title={'Result'} onPress={onPressResult} />
      </View>

      <View style={styles.mapBox}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName="MapScreen"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'pink' },
            }}
          >
            <Stack.Screen name="MapScreen" component={MapScreen} />
            <Stack.Screen name="ClearScreen" component={ClearScreen} />
            <Stack.Screen name="ResultScreen" component={ResultScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );
};

export default App;
