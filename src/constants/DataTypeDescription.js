const RESEARCHER_CONTACT = 'nicol90820@kse.kaist.ac.kr';

const ACCESS_DESCRIPTION = `Who can access?\nResearchers from ICLab, KAIST\n(${RESEARCHER_CONTACT})`;
const COLLECTED_DATATYPE_TITLE = '무엇을 수집하나요?';

const DATATYPE_DESCRIPTION = {
  bluetooth: {
    description: `${COLLECTED_DATATYPE_TITLE}\n사용자 근처 네트워크 망 정보를 주기적으로 기록\n(블루투스 기기 이름, 네트워크 신호 세기 등)\n\n${ACCESS_DESCRIPTION}`,
  },
  wifi: {
    description: `${COLLECTED_DATATYPE_TITLE}\n사용자 근처 네트워크 망 정보를 주기적으로 기록\n(Wi-Fi 이름, 네트워크 신호 세기 등)\n\n${ACCESS_DESCRIPTION}`,
  },
  battery: {
    description: `${COLLECTED_DATATYPE_TITLE}\n스마트폰 배터리 잔량 기록\n\n${ACCESS_DESCRIPTION}`,
  },
  data_traffic: {
    description: `${COLLECTED_DATATYPE_TITLE}\n사용자 스마트폰의 네트워크 사용량 기록 (통신 시각, 네트워크 통신 용량)\n\n${ACCESS_DESCRIPTION}`,
  },
  device_event: {
    description: `${COLLECTED_DATATYPE_TITLE}\n소리/진동/무음 모드, 전원 및 화면 온오프 등 스마트폰 상태 기록 \n\n${ACCESS_DESCRIPTION}`,
  },
  message: {
    description: `${COLLECTED_DATATYPE_TITLE}\n문자 연락에 대한 기록(암호화된 전화번호, 문자 종류(SMS/MMS) 등)*암호화된 번호는 복호화할 수 없음\n\n${ACCESS_DESCRIPTION}`,
  },
  call_log: {
    description: `${COLLECTED_DATATYPE_TITLE}\n전화 연락에 대한 기록 (암호화된 전화번호, 연락 시간, 연락 횟수 등) *암호화된 번호는 복호화할 수 없음\n\n${ACCESS_DESCRIPTION}`,
  },
  installed_app: {
    description: `${COLLECTED_DATATYPE_TITLE}\n설치한 앱 리스트 기록\n\n${ACCESS_DESCRIPTION}`,
  },
  location: {
    description: `${COLLECTED_DATATYPE_TITLE}\nGPS 센서를 통해 사용자 위치 정보를 주기적으로 기록\n\n${ACCESS_DESCRIPTION}`,
  },
  media: {
    description: `${COLLECTED_DATATYPE_TITLE}\n스마트폰 카메라 및 화면 녹화를 사용한 기록 (사진 찍은 시각, 화면 녹화 시각, 사진or영상 여부 등) *사진/영상 자체는 수집하지 않음 \n\n${ACCESS_DESCRIPTION}`,
  },
  app_usage_event: {
    description: `${COLLECTED_DATATYPE_TITLE}\n설치한 앱 리스트 및 앱 사용 시간 기록\n\n${ACCESS_DESCRIPTION}`,
  },
  notification: {
    description: `${COLLECTED_DATATYPE_TITLE}\n상단 알림 바에 도착한 앱 메세지 (알림 앱 이름, 알림 시각 등) *알림 메세지 내용은 수집하지 않음 \n\n${ACCESS_DESCRIPTION}`,
  },
};

export {DATATYPE_DESCRIPTION};
