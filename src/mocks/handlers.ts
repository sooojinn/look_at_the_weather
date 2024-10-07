import { HttpResponse, http, delay } from 'msw';
import { BASEURL } from '@/config/constants';

import { generateMockPosts } from './mockPostData';

type EmailFindRequestBody = {
  name: string;
  nickname: string;
};

type PasswordFindRequestBody = {
  name: string;
  nickname: string;
  email: string;
};

type LoginRequestBody = {
  email: string;
  password: string;
};

type EmailVerifyRequestBody = {
  email: string;
  code: string;
};

interface RequestLocationDTO {
  latitude: number;
  longitude: number;
}

export const handlers = [
  http.all('*', async () => {
    await delay(100);
  }),

  // 회원가입
  http.post(`${BASEURL}/users/register`, async () => {
    return HttpResponse.json({
      success: true,
      message: '회원가입 완료',
    });
  }),
  // 이메일 인증
  http.post(`${BASEURL}/email/send-verification`, async () => {
    return HttpResponse.json({
      success: true,
      message: '이메일로 코드를 발송하였습니다.',
    });
  }),
  // 이메일 발송성공
  http.post(`${BASEURL}/email/verify-code`, async ({ request }) => {
    const result = (await request.json()) as EmailVerifyRequestBody;
    const email = result?.email;
    const code = result?.code;
    if (email === 'test123@naver.com' && code === '123456') {
      return HttpResponse.json(
        {
          success: true,
          message: '이메일 검증이 완료되었습니다',
        },
        { status: 200 },
      );
    } else {
      return HttpResponse.json(
        {
          errorCode: 'FAIL_EMAIL_VERIFICATION',
          errorMessage: '이메일 검증이 실패하였습니다.',
        },
        { status: 400 },
      );
    }
  }),
  //닉네임 중복확인
  http.get(`${BASEURL}/users/nickname-check/:nickname`, async ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.pathname.split('/').pop() as string;
    const existingNicknames = ['우승찬', '김양선', '박서연', ''];
    const isAvailable = !existingNicknames.includes(nickname);

    if (isAvailable) {
      return HttpResponse.json({
        isAvailable: true,
        message: '사용가능한 닉네임입니다.',
      });
    } else {
      return HttpResponse.json({
        isAvailable: false,
        message: '이미 사용 중인 닉네임입니다.',
      });
    }
  }),
  //이메일 찾기
  http.post(`${BASEURL}/users/email`, async ({ request }) => {
    const result = (await request.json()) as EmailFindRequestBody;

    const name = result?.name;
    const nickname = result?.nickname;

    if (name === '우승찬' && nickname === '아이스베어') {
      return HttpResponse.json({
        email: 'test123@naver.com',
      });
    } else {
      return new HttpResponse(null, {
        status: 400,
        statusText: '일치하는 사용자가 없습니다.',
      });
    }
  }),
  //비밀번호 찾기
  http.post(`${BASEURL}/users/password`, async ({ request }) => {
    const result = (await request.json()) as PasswordFindRequestBody;

    const email = result?.email;
    const name = result?.name;
    const nickname = result?.nickname;

    if (email === 'test123@naver.com' && name === '우승찬' && nickname === '아이스베어') {
      return new HttpResponse(
        JSON.stringify({
          success: true,
          message: '일치하는 계정이 있습니다.',
        }),
        {
          status: 200,
        },
      );
    } else {
      return new HttpResponse(null, {
        status: 400,
        statusText: '일치하는 계정이 없습니다.',
      });
    }
  }),
  // 로그인
  http.post(`${BASEURL}/auth/login`, async ({ request }) => {
    const data = {
      accessToken: '12345',
      refreshToken: '1234',
    };

    const result = (await request.json()) as LoginRequestBody;

    const email = result?.email;
    const password = result?.password;

    if (email === 'test123@naver.com' && password === '123123123') {
      return new HttpResponse(JSON.stringify(data), {
        status: 200,
      });
    } else {
      return new HttpResponse(null, {
        status: 400,
        statusText: `login_faild`,
      });
    }
  }),

  // 메인 페이지 오늘의 베스트 코디 목록 조회
  http.get(`${BASEURL}/posts/top-liked`, async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');

    // 페이지와 사이즈 값 유효성 검사
    if (isNaN(page) || isNaN(size) || page < 0 || size <= 0) {
      return HttpResponse.json(
        {
          errorCode: 'ERROR_SEARCH_FILTER',
          errorMessage: '게시글 조회 실패',
        },
        { status: 400 },
      );
    }

    // 모의 데이터 생성
    const mockPosts = generateMockPosts(size);

    return HttpResponse.json(mockPosts, { status: 200 });
  }),

  // 현재 위치 조회
  http.post(`${BASEURL}/locations`, async ({ request }) => {
    const body = (await request.json()) as RequestLocationDTO;
    const { latitude, longitude } = body;

    // 위도와 경도 정보의 유효성 검사
    if (latitude === undefined || longitude === undefined || isNaN(latitude) || isNaN(longitude)) {
      return HttpResponse.json(
        {
          errorCode: 'INVALID_INPUT',
          errorMessage: '위도와 경도 정보가 유효하지 않습니다.',
        },
        { status: 400 },
      );
    }

    const locationResponse = {
      location: {
        city: '서울시',
        district: '강남구',
      },
    };

    return HttpResponse.json(locationResponse, { status: 200 });
  }),

  // 게시물 좋아요
  http.post(`${BASEURL}/posts/:postId/like`, async () => {
    // 예시를 위해 항상 성공하는 것으로 가정
    return HttpResponse.json(
      {
        success: true,
        message: '게시글 좋아요 성공',
      },
      { status: 200 },
    );
  }),

  // 게시물 좋아요 삭제
  http.delete(`${BASEURL}/posts/:postId/like`, async () => {
    // 예시를 위해 항상 성공하는 것으로 가정
    return HttpResponse.json(
      {
        success: true,
        message: '게시글 좋아요 삭제 성공',
      },
      { status: 200 },
    );
  }),

  http.post(`${BASEURL}/api/v1/s3/post-image`, async () => {
    // 3초 지연 후 응답 반환
    await new Promise<void>((resolve) => setTimeout(resolve, 3000));

    const id = Date.now();
    return HttpResponse.json({ id: id }, { status: 201 });
  }),

  http.post(`${BASEURL}/api/v1/posts`, async () => {
    return HttpResponse.json(
      {
        success: true,
        message: '게시글 등록 성공',
      },
      { status: 200 },
    );
  }),

  http.put(`${BASEURL}/api/v1/posts/:postId`, async () => {
    return HttpResponse.json(
      {
        success: true,
        message: '게시글 수정 성공',
      },
      { status: 200 },
    );
  }),

  // 게시물 작성 중 이미지 삭제
  http.delete(`${BASEURL}/api/v1/s3/post-image/:imageId`, ({ params }) => {
    const { imageId } = params;
    if (imageId) {
      return HttpResponse.json({}, { status: 201 });
    } else {
      return HttpResponse.json(
        {
          errorCode: 'FAIL_DELETE_POST',
          errorMessage: '게시글 삭제 실패',
        },
        { status: 400 },
      );
    }
  }),
];
