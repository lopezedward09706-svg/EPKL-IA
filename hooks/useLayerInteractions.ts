
import { useState, useCallback } from 'react';

export const useLayerInteractions = () => {
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);

  const onMouseEnter = useCallback((id: number) => {
    setHoveredLayer(id);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHoveredLayer(null);
  }, []);

  return {
    hoveredLayer,
    onMouseEnter,
    onMouseLeave
  };
};
