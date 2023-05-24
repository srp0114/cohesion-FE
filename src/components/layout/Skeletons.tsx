import { Avatar } from "@mui/joy";
import { Box, Grid, Skeleton, Stack } from "@mui/material";


export const BoardSkeleton = () => (
    <Stack spacing={"2.25rem"}>
        <Skeleton variant="text" sx={{ fontSize: "2rem" }} animation="wave" width={"12rem"} />
        <Skeleton variant="rounded" width={"100%"} height={"16rem"} animation={"pulse"} sx={{ borderRadius: "50px" }} />
        <Skeleton variant="rounded" width={"100%"} height={"16rem"} animation={"pulse"} sx={{ borderRadius: "50px" }} />
        <Skeleton variant="rounded" width={"100%"} height={"16rem"} animation={"pulse"} sx={{ borderRadius: "50px" }} />
        <Skeleton variant="rounded" width={"100%"} height={"16rem"} animation={"pulse"} sx={{ borderRadius: "50px" }} />
    </Stack>
);

export const RecruitBoardSkeleton = () => (
    <Stack direction="column" spacing={"2.25rem"}>
        <Skeleton variant="text" sx={{ fontSize: "2rem" }} animation="wave" width={"12rem"} />
        <Stack spacing={"2.25rem"} direction="row">
            <Skeleton variant="rounded" width={"30%"} height={"16rem"} animation={"pulse"} sx={{ borderRadius: "50px" }} />
            <Skeleton variant="rounded" width={"30%"} height={"16rem"} animation={"pulse"} sx={{ borderRadius: "50px" }} />
            <Skeleton variant="rounded" width={"30%"} height={"16rem"} animation={"pulse"} sx={{ borderRadius: "50px" }} />
        </Stack>
        <Stack spacing={"2.25rem"} direction="row">
            <Skeleton variant="rounded" width={"30%"} height={"16rem"} animation={"pulse"} sx={{ borderRadius: "50px" }} />
            <Skeleton variant="rounded" width={"30%"} height={"16rem"} animation={"pulse"} sx={{ borderRadius: "50px" }} />
            <Skeleton variant="rounded" width={"30%"} height={"16rem"} animation={"pulse"} sx={{ borderRadius: "50px" }} />
        </Stack>
        <Stack spacing={"2.25rem"} direction="row">
            <Skeleton variant="rounded" width={"30%"} height={"16rem"} animation={"pulse"} sx={{ borderRadius: "50px" }} />
            <Skeleton variant="rounded" width={"30%"} height={"16rem"} animation={"pulse"} sx={{ borderRadius: "50px" }} />
            <Skeleton variant="rounded" width={"30%"} height={"16rem"} animation={"pulse"} sx={{ borderRadius: "50px" }} />
        </Stack>
    </Stack>
);

export const PostingSkeleton = () => (
    <>
        <Stack direction="column" spacing={"3rem"}>
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={"13rem"} />

            <Skeleton variant="text" sx={{ fontSize: '2rem' }} />

            <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                    <Skeleton variant="circular" height={"3rem"} width={"3rem"} sx={{ marginRight: "0.75rem" }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </Box>

                <Skeleton variant="text" sx={{ fontSize: '1.125rem' }} width={"5rem"} />
            </Stack>
            {/* For other variants, adjust the size with `width` and `height` */}
            <Skeleton variant="rectangular" width={'100%'} height={"16rem"} />

            <Skeleton variant="rectangular" width={'15rem'} sx={{ fontSize: '1.5rem' }} />

            <Skeleton variant="rounded" width={'100%'} sx={{ fontSize: '1.5rem', borderRadius: "20px" }} />
        </Stack>

    </>


);

export const MyPageSkeleton = () => (
    <>
        <Stack direction="row" spacing="2.25rem" sx={{display:"flex", justifyContent:"space=between"}}>
            <Box sx={{ width: '40%' }}>
                <Skeleton variant="rectangular" height={"16rem"} width={"100%"} sx={{ borderRadius: "20px", marginBottom: "1.5rem" }} />
                <Skeleton variant="rectangular" height={"12rem"} width={"100%"} sx={{ borderRadius: "20px", marginBottom: "1.5rem" }} />
            </Box>


            <Stack direction="column" sx={{ display: "flex", justifyContent: "flex-start", alignItems: "stretch" }}>
                <Stack direction="row" spacing={"2.5rem"}>
                    <Skeleton variant="rectangular" height={"4rem"} width={"4rem"} sx={{ borderRadius: "20px" }} />
                    <Skeleton variant="rectangular" height={"4rem"} width={"4rem"} sx={{ borderRadius: "20px" }} />
                    <Skeleton variant="rectangular" height={"4rem"} width={"4rem"} sx={{ borderRadius: "20px" }} />
                    <Skeleton variant="rectangular" height={"4rem"} width={"4rem"} sx={{ borderRadius: "20px" }} />
                </Stack>


                <Box sx={{ width: "250%" }}>
                    <Skeleton variant="text" sx={{ fontSize: "2rem", marginBottom: "1.5rem" }} animation="wave" width={"6rem"} />
                    <Stack direction="row" spacing="1rem">
                        <Skeleton variant="rectangular" width={'20%'} height={"4rem"} sx={{ borderRadius: "50px" }} />
                        <Skeleton variant="rectangular" width={'60%'} height={"4rem"} sx={{ borderRadius: "50px" }} />
                        <Skeleton variant="rectangular" width={'10%'} height={"4rem"} sx={{ borderRadius: "50px" }} />
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    </>
);