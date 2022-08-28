import React from 'react'

export const AccountIcon: React.FC<{ color: string }> = ({ color }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" fill="none" viewBox="0 0 18 16">
      <path
        fill={color}
        d="M17.333 6.333v8.334a.834.834 0 01-.833.833h-15a.833.833 0 01-.833-.833V6.333h16.666zm0-1.666H.667V1.333A.833.833 0 011.5.5h15a.833.833 0 01.833.833v3.334zM11.5 11.333V13h3.333v-1.667H11.5z"
      ></path>
    </svg>
  )
}
