import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Notes: undefined;
};

export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

export type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type NotesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Notes'
>;

export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type NotesScreenRouteProp = RouteProp<RootStackParamList, 'Notes'>;
