import Button from '../molecules/Button';
import WarningModal from './WarningModal';

export default function LocationPermissionModal({ onClose }: { onClose: () => void }) {
  return (
    <WarningModal
      mainMessage="내 위치 설정"
      subMessage={
        <p>
          사용기기의 설정에서 위치 정보
          <br />
          접근을 허용해주시길 바랍니다.
        </p>
      }
      detailMessage={
        <p>
          *iOS: 설정 &gt; 개인정보 보호 및 보안 &gt; 위치 서비스 &gt;
          <br />
          현재 사용 중인 브라우저 &gt; 허용
          <br />
          *Android: 설정 &gt; 애플리케이션 &gt;
          <br />
          현재 사용 중인 브라우저 &gt; 권한 &gt; 허용
        </p>
      }
      buttons={
        <Button type="sub" size="m" width={100} onClick={onClose}>
          닫기
        </Button>
      }
    />
  );
}
