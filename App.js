import * as React from 'react';
import { Text, View, SafeAreaView, ScrollView, StatusBar, Image, StyleSheet, FlatList, Dimensions, Animated, Linking, TouchableOpacity } from 'react-native';
import { Ionicons, EvilIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { FlingGestureHandler,TapGestureHandler, Directions, State } from 'react-native-gesture-handler';
import {Button, Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from  './src/navigation/Index';
import {Provider as StoreProvider} from 'react-redux';
import store from './src/reducer/store';
import CountDown from 'react-native-countdown-component';
import Hyperlink from 'react-native-hyperlink';


//DATA AND CONSTATants
const DATA = [
  {
    title: 'Wim Hof Breathing',
    location: 'https://youtu.be/tybOi4hjZFQ',
    date: 'Dec 2nd, 2020',
    poster:
      'https://wp.insighttimer.com/blog/wp-content/uploads/2019/05/image.png',
  },
  {
    title: 'Seeing with Annie Dillard',
    location: 'https://youtu.be/ICkrN0gbml8',
    date: 'Dec 2nd, 2020',
    poster:
      'https://apilgriminnarnia.files.wordpress.com/2016/04/annie-dillard-young-writer.jpg',
  },
  {
    title: 'What You Want',
    location: 'https://youtu.be/O1gUqePofxI',
    date: 'Dec 2nd, 2020',
    poster:
      'https://www.yesmagazine.org/wp-content/uploads/imports/a16893d4cea44b9e8e82a6f1d677d963.jpg',
  },
  {
    title: 'Meditations',
    location: 'https://www.verywellmind.com/best-guided-meditations-4843806',
    date: 'Dec 2nd, 2020',
    poster:
      'https://i.guim.co.uk/img/media/c5a3cb22f4ae7b4a4c7462ef4d2d0c71cacb3c65/0_232_2789_1673/master/2789.jpg?width=1920&quality=85&auto=format&fit=max&s=a163398f5fbd34a5a93cecc6570d5103',
  },
  {
    title: 'Can\'t Hurt Me',
    location: 'https://youtu.be/TnR8UWVdrWQ',
    date: 'Dec 2nd, 2020',
    poster:
      'https://www.orderofman.com/wp-content/uploads/2019/01/David-Goggins.png',
  },
  {
    title: 'Explore Everything',
    location: 'https://therumpus.net/2014/01/saturday-book-review-explore-everything-by-bradley-garrett/',
    date: 'Dec 2nd, 2020',
    poster:
      'https://cdn.southampton.ac.uk/assets/imported/transforms/site/staff-profile/Photo/051560CD9779437B95B2329799B9B4CD/bradley_garrett.jpg_SIA_JPG_fit_to_width_INLINE.jpg',
  },
  {
    title: 'Wait But Why',
    location: 'https://waitbutwhy.com',
    date: 'Dec 2nd, 2020',
    poster:
      'https://383jct21p04k32hydj1dwif0-wpengine.netdna-ssl.com/wp-content/uploads/2018/01/TimUrbanDumboFeather_377-800x1200.jpg',
  },
];

const { width } = Dimensions.get('screen');
const OVERFLOW_HEIGHT = 70;
const SPACING = 10;
const ITEM_WIDTH = width * 0.76;
const ITEM_HEIGHT = ITEM_WIDTH * 1.7;
const VISIBLE_ITEMS = 3;


//Making Home View
function HomeScreen() {
  const [data, setData] = React.useState(DATA);
  const scrollXIndex = React.useRef(new Animated.Value(0)).current;
  const scrollXAnimated = React.useRef(new Animated.Value(0)).current;
  const [index, setIndex] = React.useState(0);
  const setActiveIndex = React.useCallback((activeIndex) => {
    scrollXIndex.setValue(activeIndex);
    setIndex(activeIndex);
  });

  React.useEffect(() => {
    if (index === data.length - VISIBLE_ITEMS - 1) {
      // get new data
      // fetch more data
      const newData = [...data, ...data];
      setData(newData);
    }
  });

  React.useEffect(() => {
    Animated.spring(scrollXAnimated, {
      toValue: scrollXIndex,
      useNativeDriver: true,
    }).start();
  });

  return (
    <FlingGestureHandler
      key='left'
      direction={Directions.LEFT}
      onHandlerStateChange={(ev) => {
        if (ev.nativeEvent.state === State.END) {
          if (index === data.length - 1) {
            return;
          }
          setActiveIndex(index + 1);
        }
      }}
    >
      <FlingGestureHandler
        key='right'
        direction={Directions.RIGHT}
        onHandlerStateChange={(ev) => {
          if (ev.nativeEvent.state === State.END) {
            if (index === 0) {
              return;
            }
            setActiveIndex(index - 1);
          }
        }}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar hidden />
          
            <View style = {{paddingHorizontal: 40, paddingTop: 30, paddingRight: 140}}>
              <Text style= {{fontSize: 40, fontWeight: "bold"}}>Momentum</Text>
            </View>
          <TouchableOpacity activeOpacity = {1} style = {{ flex: 1,
              justifyContent: 'center',
              padding: SPACING * 2,
              marginTop: 35}} onPress = {() => Linking.openURL(data[index].location)}>
          <FlatList
            data={data}
            keyExtractor={(_, index) => String(index)}
            horizontal
            inverted
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center'
            }}
            scrollEnabled={false}
            removeClippedSubviews={false}
            CellRendererComponent={({
              item,
              index,
              children,
              style,
              ...props
            }) => {
              const newStyle = [style, { zIndex: data.length - index }];
              return (
                <View style={newStyle} index={index} {...props}>
                  {children}
                </View>
              );
            }}
            renderItem={({ item, index }) => {
              const inputRange = [index - 1, index, index + 1];
              const translateX = scrollXAnimated.interpolate({
                inputRange,
                outputRange: [50, 0, -100],
              });
              const scale = scrollXAnimated.interpolate({
                inputRange,
                outputRange: [0.8, 1, 1.3],
              });
              const opacity = scrollXAnimated.interpolate({
                inputRange,
                outputRange: [1 - 1 / VISIBLE_ITEMS, 1, 0],
              });

              return (
                <Animated.View
                  style={{
                    position: 'absolute',
                    left: -ITEM_WIDTH / 2,
                    opacity,
                    transform: [
                      {
                        translateX,
                      },
                      { scale },
                    ],
                  }}
                >
              
                  <Image
                    source={{ uri: item.poster }}
                    style={{
                      width: ITEM_WIDTH,
                      height: ITEM_HEIGHT,
                      borderRadius: 15,
                    }}
                  />
               <Text style = {{paddingTop: 30, fontSize: 20, fontWeight: 'bold'}}>
                    {item.title}
                    </Text>
                </Animated.View>
              );
            }}
          />
          </TouchableOpacity>
        </SafeAreaView>
      </FlingGestureHandler>
    </FlingGestureHandler>
    
  );
}
//Home View Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  location: {
    fontSize: 16,
  },
  date: {
    fontSize: 12,
  },
  itemContainer: {
    height: OVERFLOW_HEIGHT,
    padding: SPACING * 2,
  },
  itemContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overflowContainer: {
    height: OVERFLOW_HEIGHT,
    overflow: 'hidden',
  },
});

//Making Log Screen
function LogScreen() {
  return (
    <StoreProvider store = {store}>
    <PaperProvider>
      <AppNavigator/>
    </PaperProvider>
    </StoreProvider>
  );
}


function MeditationScreen(){

  const meditations = require('meditations');
  const con = meditations.random();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style = {{fontSize: 40, paddingBottom: 20, paddingTop: 70}}>
        Go For A Walk!
      </Text>
  
       <CountDown
        size={40}
        until={1000}
        onFinish={() => alert('Finished')}
        digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#98ff98'}}
        digitTxtStyle={{color: '#98ff98'}}
        timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
        separatorStyle={{color: '#98ff98'}}
        timeToShow={['H', 'M', 'S']}
        timeLabels={{m: null, s: null}}
        showSeparator
      />
      <ScrollView style={{paddingTop: 20}}>
      <Text style={{justifyContent: 'center', padding: 20}}>"{con}"</Text>
      </ScrollView>
    </View>
  );
}

const Tab = createBottomTabNavigator();

//Making the main App
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'ios-home' : 'ios-home';
            } else if (route.name === 'Log') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            } else if (route.name === 'Meditate'){
              iconName = focused ? 'ios-body' : 'ios-body';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#98ff98',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Meditate" component={MeditationScreen} />
        <Tab.Screen name="Log" component={LogScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

