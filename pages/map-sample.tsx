import React, { useEffect } from "react";
import MapComponent from "../components/mapComponent";

const Map: React.FC = () => {
  const kakaoMap = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!(window as any).kakao) {
      console.error('kakao map api not loaded!');
      return;
    }

    (window as any).kakao.maps.load(() => {
      if (!kakaoMap || !kakaoMap.current) {
        console.error('map element is not ready!');
        return;
      }

      const x = 126.570667;
      const y = 33.450701;
      const coords = new (window as any).kakao.maps.LatLng(y, x); // 지도의 중심좌표
      const options = {
        center: coords,
        level: 2,
      };
      const map = new (window as any).kakao.maps.Map(kakaoMap.current, options);
      const marker = new (window as any).kakao.maps.Marker({
        position: coords,
        map,
      });
      // 맵의 중앙으로 이동
      map.relayout();
      map.setCenter(coords);
      // 마커를 중앙으로 이동
      marker.setPosition(coords);

      // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
      const mapTypeControl = new (window as any).kakao.maps.MapTypeControl();

      // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
      // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
      map.addControl(
        mapTypeControl,
        (window as any).kakao.maps.ControlPosition.TOPRIGHT
      );
      // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
      const zoomControl = new (window as any).kakao.maps.ZoomControl();
      map.addControl(
        zoomControl,
        (window as any).kakao.maps.ControlPosition.RIGHT
      );
    })
  }, [kakaoMap]);

  return <MapComponent ref={kakaoMap} />;
};

export default Map;
