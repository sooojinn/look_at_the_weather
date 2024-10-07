import { useEffect, useState, useRef, useCallback } from 'react';
import Header from '@components/common/Header';
import Text from '@components/common/atom/Text';
import HrLine from '@components/common/atom/HrLine';
import VeLine from '@components/common/atom/VeLine';
import FilterBtn from '@components/common/atom/FilterBtnComp';
import { ResetIcon } from '@components/icons/ResetIcon';
import PostFilterModal from '@components/common/atom/PostFilterModal';
import { PostList } from '@components/post/PostList';
import { usePostStore } from '@/store/postStore';
import { DistrictType, FilterItem, PostMeta, PostFilterState } from '@/config/types';
import FooterNavi from '@components/common/FooterNavi';
import useLocationData from '@/hooks/useLocationData';
import Loading from '@components/common/atom/Loading';
import { postFilteredPosts, allPosts } from '@/api/apis';
import NoPost from '@components/icons/NoPost';
import LookWeatherInfo from '@components/weather/LookWeatherInfo';

export default function Post() {
  const { location } = useLocationData();
  const {
    locationIds,
    seasonTagIds,
    temperatureTagIds,
    weatherTagIds,
    updateLocation,
    updateWeatherTagIds,
    updateTemperatureTagIds,
    updateSeasonTagIds,
  } = usePostStore();

  const [isOpen, setIsOpen] = useState(false);
  const [btnIndex, setBtnIndex] = useState(0);
  const [btnValue, setBtnValue] = useState('');

  const [locationArr, setLocationArr] = useState<DistrictType[]>([]);
  const [weatherArr, setWeatherArr] = useState<FilterItem[]>([]);
  const [temperatureArr, setTemperatureArr] = useState<FilterItem[]>([]);
  const [seasonArr, setSeasonArr] = useState<FilterItem[]>([]);

  const [sortOrder, setSortOrder] = useState('LATEST');
  const [postList, setPostList] = useState<PostMeta[]>([]);
  const [hasFilterData, setHasFilterData] = useState<null | boolean>(null);
  const [filterState, setFilterState] = useState<PostFilterState>({
    location: [],
    seasonTagIds: [],
    temperatureTagIds: [],
    weatherTagIds: [],
  });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [noPost, setNoPost] = useState(false);

  const pageEnd = useRef<HTMLDivElement>(null);

  const onClickFilterBtn = (btnIndex: number, btnString: string) => {
    setBtnIndex(btnIndex);
    setBtnValue(btnString);
    setIsOpen(true);
  };

  const onClickResetBtn = () => {
    setPostList([]);
    setHasMore(true);
    setPage(0);
    updateLocation([]);
    updateWeatherTagIds([]);
    updateTemperatureTagIds([]);
    updateSeasonTagIds([]);
    setLocationArr([]);
    setSeasonArr([]);
    setWeatherArr([]);
    setTemperatureArr([]);
  };

  useEffect(() => {
    setLocationArr(locationIds);
    setSeasonArr(seasonTagIds);
    setWeatherArr(weatherTagIds);
    setTemperatureArr(temperatureTagIds);
  }, [isOpen]);

  const getAllPosts = useCallback(
    async (pageNum: number) => {
      if (!hasMore) return;
      setLoading(true);

      if (!location || !location.city || !location.district) {
        return;
      }
      try {
        const slicedCity = location.city.substring(0, 2);
        const response = await allPosts(pageNum, slicedCity, location.district, sortOrder);
        const updatePostList = response.data.posts.map((item: PostMeta) => ({ ...item, location }));

        setPostList((prev) => [...prev, ...updatePostList]);
        setPage(pageNum + 1);
        setHasMore(updatePostList.length > 0);
        setNoPost(updatePostList.length === 0 && pageNum === 0);
      } catch (error) {
        // 임시 작성코드
        setLoading(false);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [sortOrder, location],
  );

  const getFilteredPosts = useCallback(
    async (pageNum: number) => {
      if (!hasMore) return;
      setLoading(true);
      try {
        const response = await postFilteredPosts({
          page: pageNum,
          location: filterState.location,
          sort: sortOrder,
          seasonTagIds: filterState.seasonTagIds,
          weatherTagIds: filterState.weatherTagIds,
          temperatureTagIds: filterState.temperatureTagIds,
        });

        const newPosts = response.data.posts;
        setPostList((prev) => [...prev, ...newPosts]);
        setPage(pageNum + 1);
        setHasMore(newPosts.length > 0);
        setNoPost(newPosts.length === 0 && pageNum === 0);
      } catch (error) {
        setLoading(false);
        setHasMore(false);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [hasMore, filterState],
  );

  useEffect(() => {
    setPostList([]);
    setNoPost(false);
    setPage(0);

    if (location && hasFilterData !== null) {
      setPage(0);
      if (!hasFilterData) {
        getAllPosts(0);
      } else {
        getFilteredPosts(0);
      }
    }
  }, [location, hasFilterData, filterState, sortOrder]);

  useEffect(() => {
    setHasMore(true);
  }, [getAllPosts, getFilteredPosts]);

  useEffect(() => {
    const areAllEmptyArrays = (...arrs: any[][]): boolean => {
      for (const arr of arrs) {
        if (!Array.isArray(arr) || arr.length !== 0) {
          return false;
        }
      }
      return true;
    };

    const isEmptyFilter = areAllEmptyArrays(locationIds, seasonTagIds, temperatureTagIds, weatherTagIds);

    if (!isEmptyFilter) {
      const locationIdArray = locationIds.map((loc) => ({
        city: loc.cityId,
        district: loc.districtId,
      }));
      const seasonIds = seasonTagIds.map((tag) => tag.id);
      const temperatureIds = temperatureTagIds.map((tag) => tag.id);
      const weatherIds = weatherTagIds.map((tag) => tag.id);

      setFilterState({
        location: locationIdArray,
        seasonTagIds: seasonIds as number[],
        temperatureTagIds: temperatureIds as number[],
        weatherTagIds: weatherIds as number[],
      });
    }

    isEmptyFilter ? setHasFilterData(false) : setHasFilterData(true);
  }, [locationIds, seasonTagIds, temperatureTagIds, weatherTagIds]);

  useEffect(() => {
    if (!loading && hasMore) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (hasFilterData !== null) {
            if (entries[0].isIntersecting) {
              hasFilterData ? getFilteredPosts(page) : getAllPosts(page);
            }
          }
        },
        { threshold: 0.7 },
      );

      if (pageEnd.current) {
        observer.observe(pageEnd.current);
      }

      return () => {
        if (pageEnd.current) {
          observer.unobserve(pageEnd.current);
        }
      };
    }
  }, [loading]);

  return (
    <div className="h-screen relative">
      <Header>Look</Header>
      <div className="px-5">
        <LookWeatherInfo />
        <HrLine height={1} />
        <div className="flex gap-4 items-center py-4">
          <ResetIcon onClick={onClickResetBtn} />
          <VeLine height={8} />
          <div className="flex gap-2 overflow-y-auto scrollbar-hide">
            <FilterBtn isActive={!!locationArr.length} onClickFunc={() => onClickFilterBtn(0, 'location')}>
              {locationArr.length > 1
                ? `${locationArr[0].districtName} 외 ${locationArr.length - 1}`
                : locationArr.length === 1
                ? `${locationArr[0].districtName}`
                : '지역'}
            </FilterBtn>
            <FilterBtn isActive={!!weatherArr.length} onClickFunc={() => onClickFilterBtn(1, 'weather')}>
              {weatherArr.length > 1
                ? `${weatherArr[0].tagName} 외 ${weatherArr.length - 1}`
                : weatherArr.length === 1
                ? `${weatherArr[0].tagName}`
                : '날씨'}
            </FilterBtn>
            <FilterBtn isActive={!!temperatureArr.length} onClickFunc={() => onClickFilterBtn(2, 'temperature')}>
              {temperatureArr.length > 1
                ? `${temperatureArr[0].tagName} 외 ${temperatureArr.length - 1}`
                : temperatureArr.length === 1
                ? `${temperatureArr[0].tagName}`
                : '온도'}
            </FilterBtn>
            <FilterBtn isActive={!!seasonArr.length} onClickFunc={() => onClickFilterBtn(3, 'season')}>
              {seasonArr.length > 1
                ? `${seasonArr[0].tagName} 외 ${seasonArr.length - 1}`
                : seasonArr.length === 1
                ? `${seasonArr[0].tagName}`
                : '계절'}
            </FilterBtn>
          </div>
        </div>
        <HrLine height={8} />
        <div className="py-5">
          <div className="flex row justify-end">
            <div onClick={() => setSortOrder('LATEST')}>
              <Text
                color={sortOrder === 'LATEST' ? 'gray' : 'lightGray'}
                weight={sortOrder === 'LATEST' ? 'bold' : 'regular'}
              >
                최신순
              </Text>
            </div>
            <div className="mx-2">
              <VeLine height={8} />
            </div>
            <div onClick={() => setSortOrder('RECOMMENDED')}>
              <Text
                color={sortOrder === 'RECOMMENDED' ? 'gray' : 'lightGray'}
                weight={sortOrder === 'RECOMMENDED' ? 'bold' : 'regular'}
              >
                추천순
              </Text>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white">
        {noPost ? (
          <div className="flex flex-col justify-center items-center pt-[100px] pb-[119px]">
            <NoPost className="mb-[20px]" />
            <Text weight="bold" size="xl" color="lightBlack" className="mb-[6px]">
              조건에 맞는 게시물이 없어요
            </Text>
            <Text color="gray">더 넓은 범위로</Text>
            <Text color="gray">검색해 보시는 건 어떨까요?</Text>
          </div>
        ) : (
          <PostList postList={postList}></PostList>
        )}
        <Loading ref={pageEnd} isLoading={loading} />
      </div>
      <FooterNavi />
      {isOpen ? <PostFilterModal isOpen={setIsOpen} btnIndex={btnIndex} btnValue={btnValue} /> : null}
    </div>
  );
}
