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

                <Skeleton variant="text" sx={{ fontSize: '1.125rem'}} width={"5rem"} />
            </Stack>
            {/* For other variants, adjust the size with `width` and `height` */}
            <Skeleton variant="rectangular" width={'100%'} height={"16rem"} />

            <Skeleton variant="rectangular" width={'15rem'} sx={{ fontSize: '1.5rem' }} />

            <Skeleton variant="rounded" width={'100%'} sx={{ fontSize: '1.5rem', borderRadius: "20px" }} />
        </Stack>

    </>


);