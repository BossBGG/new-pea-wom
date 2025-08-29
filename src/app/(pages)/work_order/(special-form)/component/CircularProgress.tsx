import React from "react"

type CircularProgressProps = {
  value: number
  total: number
  size?: number
  strokeWidth?: number
  color?: string
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
                                                    value,
                                                    total,
                                                    size = 75,
                                                    strokeWidth = 8,
                                                    color = "#F9AC12", // สีแบบในภาพ
                                                  }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (value / total) * circumference

  return (
    <svg width={size} height={size} className="block">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#FDE5B6"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="16"
        fill="#333"
        fontWeight="bold"
      >
        {value}/{total}
      </text>
    </svg>
  )
}
