import React, { useEffect } from "react";
import MapComponent from "../components/mapComponent";
import getCatPositions from "../channel/catPositions";

// TODO: fix types
type Map = {};
type Size = {};
type Image = {};

const createMarkerImage = (src: string, size: Size, options?: any) => {
  const { kakao } = window as any;
  return new kakao.maps.MarkerImage(src, size, options);
}

// 임시 마커 생성 - 고양이 아이콘
// TODO: use image thumbnail
const createMarkers = (map: Map) => {
  const { kakao } = window as any;
  const imgSrc = 'https://icon-library.com/images/cat-face-icon/cat-face-icon-4.jpg';
  const imgSize = new kakao.maps.Size(60, 54);

  const Marker = kakao.maps.Marker;
  const LatLng = kakao.maps.LatLng;

  const markers = getCatPositions().map(pos => {
    return new Marker({
      position: new LatLng(pos.lat, pos.lng),
      image: createMarkerImage(imgSrc, imgSize),
      map,
    })
  });

  return markers;
};


// source ref)
// https://flamingotiger.github.io/frontend/react/react-kakao-map/
// https://gingerkang.tistory.com/65
const Map: React.FC = () => {
  const kakaoMap = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { kakao } = window as any;

    if (!kakao) {
      console.error('kakao map api not loaded!');
      return;
    }

    kakao.maps.load(() => {
      if (!kakaoMap || !kakaoMap.current) {
        console.error('map element is not ready!');
        return;
      }

      // init position: 강남역 사거리
      const x = 127.02770621963765;
      const y = 37.498004414546934;
      const coords = new kakao.maps.LatLng(y, x); // 지도의 중심좌표
      const options = {
        center: coords,
        level: 2,
      };
      const map = new kakao.maps.Map(kakaoMap.current, options);

      createMarkers(map);

      // 맵의 중앙으로 이동
      map.relayout();
      map.setCenter(coords);

      // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
      const mapTypeControl = new kakao.maps.MapTypeControl();

      // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
      // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
      map.addControl(
        mapTypeControl,
        (window as any).kakao.maps.ControlPosition.TOPRIGHT
      );
      // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
      const zoomControl = new kakao.maps.ZoomControl();
      map.addControl(
        zoomControl,
        kakao.maps.ControlPosition.RIGHT
      );
    })
  }, [kakaoMap]);

  return <MapComponent ref={kakaoMap} />;
};

export default Map;
