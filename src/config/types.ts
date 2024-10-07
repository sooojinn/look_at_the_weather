import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface WeatherInfo {
  [key: string]: any;
}

export interface Location {
  city: string;
  district: string;
}

export interface PostMeta {
  postId: number;
  thumbnail: string;
  location: Location;
  seasonTag: string;
  weatherTags: string[];
  temperatureTags: string[];
  likeByUser: boolean;
  reportPost?: boolean;
}

export type TextSize = 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl';
export type TextColor =
  | 'black'
  | 'lightBlack'
  | 'darkGray'
  | 'gray'
  | 'lightGray'
  | 'white'
  | 'main'
  | 'disabled'
  | 'error'
  | 'success';
export type TextWeight = 'regular' | 'bold';

export interface ImageItem {
  imageId: number;
  url: string;
  fileName?: string;
}

export interface PostFormData {
  title: string;
  content: string;
  city: string;
  district: string;
  weatherTagIds: number[];
  temperatureTagIds: number[];
  seasonTagId: number | null;
  imageIds: number[];
  images: ImageItem[];
}

export interface Tag {
  id: number;
  category: string;
  value: string;
  name: string;
}

export interface SelectProps {
  name: keyof PostFormData;
  options: Tag[];
  maxSelection?: number;
  rules?: RegisterOptions<PostFormData, keyof PostFormData>;
}

export interface FileProps {
  name: keyof PostFormData;
  rules?: RegisterOptions<PostFormData, keyof PostFormData>;
  defaultImageIds: number[];
}

export interface ErrorResponse {
  errorCode?: string;
  errorMessage?: string;
}

export interface VerifyCodeProps {
  email: string;
  code: string;
}

export interface FormMethods<T extends FieldValues> {
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  setError: UseFormSetError<T>;
  clearErrors: UseFormClearErrors<T>;
  trigger: UseFormTrigger<T>;
  getValues: UseFormGetValues<T>;
  watch: UseFormWatch<T>;
  formState: { errors: FieldErrors<T> };
}

export interface SignupForm {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
  name: string;
  nickname: string;
  terms: boolean;
}

export interface RegisterForm {
  email: string;
  password: string;
  name: string;
  nickname: string;
  isSocial: boolean;
}

export interface PostFilterState {
  location: { city: number; district: number }[];
  seasonTagIds: number[];
  temperatureTagIds: number[];
  weatherTagIds: number[];
}

export type DistrictType = {
  districtId: number;
  districtName: string;
  cityName: string;
  cityId: number;
};

export interface FilterItem {
  id: number | { city: number; district: number };
  tagName: string;
}

export type FilterBtn = {
  id?: string;
  onClickFunc: () => void;
  isActive?: boolean | (() => boolean);
  isSelected?: boolean;
};

export type PostFilterModalProps = {
  isOpen: React.Dispatch<React.SetStateAction<boolean>>;
  btnValue: string;
  btnIndex: number;
};
export type SectionKey = 'location' | 'weather' | 'temperature' | 'season';

export interface CityType {
  cityId: number;
  cityName: string;
  district: DistrictType[];
}

export type FilterBtnGroupProps = FilterBtn & {
  btnData: any[];
};

export interface HrLineHeight {
  height: number;
}
