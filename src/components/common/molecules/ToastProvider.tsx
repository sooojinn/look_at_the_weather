import { toast, ToastContainer, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Text from '../atom/Text';

const CustomTransition = cssTransition({
  enter: 'slideUp',
  exit: 'fadeOut',
});

export function ToastProvider() {
  return (
    <ToastContainer
      autoClose={4000}
      hideProgressBar
      closeButton={false}
      newestOnTop={false}
      transition={CustomTransition} // 사용자 정의 transition 적용
      position="bottom-center"
      theme="dark"
      toastClassName={
        () =>
          'w-[335px] flex items-center fixed bottom-24 left-[calc(50%-335px/2)] bg-lightBlack opacity-90 rounded-lg fade' // 추가된 클래스명
      }
      bodyClassName={() => 'w-full px-5 py-3'}
    />
  );
}

export function showToast(message: string, cancelBtnText: string = '', onCancel: () => void = () => {}) {
  // 토스트 표시
  const toastId = toast(
    <div className="flex justify-between items-center">
      <Text size="s" color="white">
        {message}
      </Text>
      <button
        onClick={() => {
          onCancel();
          toast.dismiss(toastId); // 버튼 클릭 시 토스트 닫기
        }}
        className="underline text-s font-bold ml-2 whitespace-nowrap"
      >
        {cancelBtnText}
      </button>
    </div>,
  );
}
