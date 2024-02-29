import { Box, Flex, HStack, MenuButton, MenuList, Text, Menu, MenuOptionGroup, MenuItemOption, Button, Icon } from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import React from 'react'
import { BsFillTriangleFill } from 'react-icons/bs'
import { RiFlag2Fill } from 'react-icons/ri'

type ProjectCardProps = {
  id: number | string
  title: string
  value: string
  number: string | number
  IconElement: React.ReactNode
  selectedCard: string
  onSelectCard: (string) => void
  isLoading: boolean
  disabled?: boolean
  styles?: any
  selectedFlagged?: any
  onSelectFlagged?: (string: string[] | null | []) => void
  selectedPreInvoiced?: boolean
  onSelectPreInvoiced?: (selection: boolean) => void
  clear?: any
}

export enum FlagEnum {
  NOTES = "notes",
  LEIN_DUE_EXPIRY = "lein-due-expiry",
  ALL="all"
}

export const ProjectCard = ({
  clear,
  title,
  disabled,
  selectedCard,
  onSelectCard,
  value,
  number,
  isLoading,
  IconElement,
  styles,
  selectedFlagged,
  onSelectFlagged,
  selectedPreInvoiced,
  onSelectPreInvoiced,
}: ProjectCardProps) => {
  const isCardFlag = !!selectedFlagged?.length;
  return (
    <>
      <Flex w={"full"}>
        <Box as="label" boxShadow="1px 0px 70px rgb(0 0 0 / 10%)" w={"full"} {...styles}>
          <Flex
            boxShadow=" 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
            minH="63px"
            borderLeftRadius={"5px"}
            bg="#FFFFFF"
            alignItems="center"
            transition="0.3s all"
            cursor={disabled ? 'not-allowed' : 'pointer'}
            justifyContent="space-between"
            border="1px solid transparent"
            borderTop="4px solid transparent"
            w={"full"}
            onClick={() => {
              !disabled && onSelectCard(selectedCard !== value ? value : null)
              onSelectFlagged && onSelectFlagged(!selectedFlagged?.length ? [FlagEnum.ALL] : null)
              onSelectPreInvoiced && onSelectPreInvoiced(selectedPreInvoiced === true ? false : true)
              if (selectedCard === value) {
                clear()
              }
            }}
            borderColor={selectedCard === value || selectedFlagged?.length || selectedPreInvoiced ? 'brand.300' : ''}
            _hover={{ bg: 'blue.50' }}
            borderRightRadius={isCardFlag ? "0px" : "5px"}
          >
            <Flex w="100%" mb="5px">
              <Text as="span" marginLeft={'7.87px'}>
                {IconElement}
              </Text>
              <HStack w="100%" justifyContent="space-between">
                <Text fontSize="14px" fontWeight="400" marginTop="4px" paddingLeft={'9.89px'} color="gray.700">
                  {title}
                </Text>
                <Text
                  fontWeight="600"
                  fontSize="20px"
                  fontStyle="normal"
                  color="gray.700"
                  pr="19.27px"
                  data-testid={`value-of-${title.toLocaleLowerCase()}`}
                  as="span"
                >
                  {isLoading ? <BlankSlate /> : number}
                </Text>
              </HStack>
            </Flex>
          </Flex>
        </Box>
        {isCardFlag &&
          <Menu closeOnSelect={false}>
            {({ isOpen }) => (<>
              <MenuButton as={Button} minW={"20px"} padding={"0px"} w={"20px"} colorScheme={'brand'} h={'full'} borderLeftRadius={"0px"} borderRightRadius={"5px"}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"} cursor={"pointer"} position={"relative"} >
                  <BsFillTriangleFill size={"9"} color='#fff' style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
                </Box>
              </MenuButton>
              <MenuList minWidth='240px'>
                <MenuOptionGroup title='Select Flag Filter' type='checkbox' onChange={(value: string | string[]) => {
                  if (onSelectFlagged && Array.isArray(value)) {
                    if (value?.length === 0) onSelectFlagged([FlagEnum.ALL])
                    else onSelectFlagged(value)
                  }
                }}>
                  <MenuItemOption value={FlagEnum.NOTES}><Icon title="Note Flag" as={RiFlag2Fill} color="rgba(252, 129, 129, 1)" mr={2} /> Notes</MenuItemOption>
                  <MenuItemOption value={FlagEnum.LEIN_DUE_EXPIRY}><Icon title="Lien Due Expiry Flag" as={RiFlag2Fill} color="rgb(236, 201, 75,1)" mr={2} /> Lein Due Expiry</MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </>)}
          </Menu>
        }
      </Flex>
    </>
  )
}
