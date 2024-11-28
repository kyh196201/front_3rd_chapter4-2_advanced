import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useCallback, useState } from "react";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";

export const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1

  const duplicate = (targetId: string) => {
    setSchedulesMap(prev => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]]
    }))
  }

  const remove = (targetId: string) => {
    setSchedulesMap(prev => {
      delete prev[targetId];
      return { ...prev };
    })
  }

  const handleScheduleTimeClick = useCallback((tableId: string, timeInfo: { day: string, time: number }) => {
    setSearchInfo({ tableId, ...timeInfo })
  }, [])

  const handleDeleteButtonClick = useCallback((tableId: string, timeInfo: { day: string, time: number }) => {
    setSchedulesMap((prev) => ({
      ...prev, 
      [tableId]: prev[tableId].filter(schedule => 
        schedule.day !== timeInfo.day || !schedule.range.includes(timeInfo.time)
      )
    }));
  }, [setSchedulesMap]);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <Stack key={tableId} width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
              <ButtonGroup size="sm" isAttached>
                <Button colorScheme="green" onClick={() => setSearchInfo({ tableId })}>시간표 추가</Button>
                <Button colorScheme="green" mx="1px" onClick={() => duplicate(tableId)}>복제</Button>
                <Button colorScheme="green" isDisabled={disabledRemoveButton}
                        onClick={() => remove(tableId)}>삭제</Button>
              </ButtonGroup>
            </Flex>

            <ScheduleDndProvider>
              <ScheduleTable
                key={`schedule-table-${index}`}
                schedules={schedules}
                tableId={tableId}
                onScheduleTimeClick={handleScheduleTimeClick}
                onDeleteButtonClick={handleDeleteButtonClick}
              />
            </ScheduleDndProvider>
          </Stack>
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)}/>
    </>
  );
}
