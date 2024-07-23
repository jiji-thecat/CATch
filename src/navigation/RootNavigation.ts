import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// how to specify name type correctly?
export const navigate = ({ name, params }: { name: any; params: any }) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate({ name, params });
  }
};
