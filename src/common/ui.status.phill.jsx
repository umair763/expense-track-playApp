import { useMemo } from 'react'

export const UiStatusPill = ({
  status,
  color = '#6B7280',
  textColor,
  borderColor,
  bgColor,
  bgOpacity = 0.12,
  borderOpacity = 1,
  borderWidth = '1.5px',
}) => {
  const hexToRgb = (hex) => {
    let value = hex?.replace('#', '').trim()

    if (value?.length === 3) {
      value = value
        .split('')
        .map((c) => c + c)
        .join('')
    }

    if (!/^[0-9a-fA-F]{6}$/.test(value)) {
      return {
        r: 107,
        g: 114,
        b: 128,
      }
    }

    return {
      r: parseInt(value.substring(0, 2), 16),
      g: parseInt(value.substring(2, 4), 16),
      b: parseInt(value.substring(4, 6), 16),
    }
  }

  const hexToRgba = (hex, opacity) => {
    const { r, g, b } = hexToRgb(hex)

    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  const styles = useMemo(() => {
    const resolvedText = textColor || color
    const resolvedBorder = borderColor || color
    const resolvedBg = bgColor || color

    return {
      color: resolvedText,
      backgroundColor: hexToRgba(resolvedBg, bgOpacity),
      borderColor: hexToRgba(resolvedBorder, borderOpacity),
      borderWidth,
    }
  }, [
    color,
    textColor,
    borderColor,
    bgColor,
    bgOpacity,
    borderOpacity,
    borderWidth,
  ])

  return (
    <span
      style={styles}
      className="
        inline-flex
        min-w-[76px]
        items-center
        justify-center
        rounded-full
        border-solid
        px-3.5
        py-1
        text-xs
        font-medium
        whitespace-nowrap
        text-center
        transition-colors
      "
    >
      {status}
    </span>
  )
}
