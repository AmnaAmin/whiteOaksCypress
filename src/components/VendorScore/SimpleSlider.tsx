import React, { useState, useEffect } from 'react'
import { Box, Text, Heading, Flex } from '@chakra-ui/react'
import { GoChevronLeft, GoChevronRight } from 'react-icons/go'
import Slider from 'react-slick'
import { Card } from '../card/card'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import { chunk } from 'lodash'
import { RiErrorWarningFill } from 'react-icons/ri'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { useTranslation } from 'react-i18next'

const isDateExpired = (date: string) => {
  const currentDate = datePickerFormat(new Date())
  const givenDate = datePickerFormat(new Date(date))

  if (givenDate! >= currentDate!) return ''
  return '#F56565'
}

export const SimpleSlider: React.FC<{
  heading: string
  isLoading: boolean
  data?: any[]
}> = props => {
  const settings = {
    dots: false,
    infinite: true,
    centerPadding: '60px',
    speed: 500,

    slidesToShow: 1,
    slidesToScroll: 1,
    center: 30,
    prevArrow: <GoChevronLeft color="#A3A9B4" />,
    nextArrow: <GoChevronRight color="#A3A9B4" />,
  }
  const [slider, setSlider] = useState<any[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    setSlider(chunk(props.data, 3))
  }, [props.data])
  return (
    <Card
      rounded="6px"
      minH="156px"
      padding={{
        base: '30px 30px 10px',
        sm: '30px 30px 10px',
        md: '30px 50px 10px',
        xl: ' 30px 40px 10px',
        '2xl': '30px 60px 10px',
      }}
    >
      {props.isLoading ? (
        <BlankSlate width="100%" h="95px" />
      ) : (
        <Box>
          <Heading
            textAlign="start"
            fontStyle="normal"
            fontWeight={500}
            fontSize="18px"
            color="gray.700"
            pb={3}
            mx={{ base: 'unset', lg: 'unset', '2xl': '5' }}
          >
            {props.heading}
          </Heading>
          {slider.length > 0 ? (
            <Slider {...settings}>
              {slider.map((slide, i) => (
                <Box key={i} textAlign="start" fontSize="16px" fontStyle="normal" fontWeight={400} color="#4A5568">
                  {slide?.map((item: any) => (
                    <SliderItem key={item.title} title={item.title} date={item.date} testId={item.testId} />
                  ))}
                </Box>
              ))}
            </Slider>
          ) : (
            <Flex mx={{ base: 'unset', '2xl': '4' }} alignItems="center" fontSize="15px" fontWeight="normal">
              <RiErrorWarningFill fontSize="30px" color="#A0AEC0" />
              <Text ml="10px" fontWeight={400} fontSize="14px" fontStyle="normal" color=" #2D3748">
                {t('errorWarning')} {props.heading}
              </Text>
            </Flex>
          )}
        </Box>
      )}
    </Card>
  )
}

const SliderItem: React.FC<{ title: string; date: string; testId?: string }> = ({ title, date, testId }) => {
  if (!date) return null
  return (
    <Flex
      mx={{ base: 'unset', '2xl': '5' }}
      whiteSpace="nowrap"
      lineHeight={1.4}
      _last={{ borderBottomWidth: 0 }}
      borderBottom="1px solid #E5E5E5"
      justifyContent="space-between"
      color={isDateExpired(date) ? isDateExpired(date) : 'gray.700'}
      alignItems="center"
      fontWeight={400}
      fontSize="14px"
      mb="2"
    >
      <Text>{title}</Text>
      <Text data-testid={testId}>{dateFormat(date)}</Text>
    </Flex>
  )
}
