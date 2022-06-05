import {
  Flex,
  Text,
  Box,
  IconButton,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  Sidebar,
  PostModal,
  PostCard,
  FollowingSuggestions,
} from "../../Components";
import { getAlluser, getpost } from "../../Redux/thunks";

export const Homepage = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [editPosts, setEditpost] = useState(null);
  const { posts, status } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.user);
  useEffect(() => {
    if (status === "idel") {
      dispatch(getpost());
      dispatch(getAlluser());
    }
  }, [status, posts, dispatch]);

  const followUsers = users.filter((userFollower) =>
    userFollower.followers?.some(
      (follower) => follower.username === user.username
    )
  );

  const allpost = posts.filter(
    (post) =>
      post.username === user.username ||
      followUsers?.some((followuser) => followuser.username === post.username)
  );

  return (
    <>
      <PostModal
        isOpen={isOpen}
        onClose={onClose}
        editPosts={editPosts}
        setEditpost={setEditpost}
      />
      <Flex flexWrap="wrap" justifyContent="space-between" marginRight="2rem">
        <Sidebar onOpen={onOpen} />
        <Flex w="45%" paddingTop="2rem" flexDirection="column" gap="2rem">
          <Box
            w="60rem"
            bg="gray.200"
            cursor="pointer"
            borderRadius="0.5rem"
            p="1rem"
            h="5rem"
            marginTop="1rem"
            onClick={onOpen}
          >
            <Flex alignContent="center" justifyContent="space-between">
              <Text fontSize="2rem" color="gray.400">
                Post Something Intresting.....
              </Text>
              <IconButton
                icon={<BsFillPlusCircleFill />}
                color="blue.600"
                fontSize="2rem"
                bg="transparent"
              />
            </Flex>
          </Box>
          {allpost?.length ? (
            [...allpost].reverse().map((post) => {
              return (
                <PostCard
                  onOpen={onOpen}
                  key={post._id}
                  post={post}
                  setEditpost={setEditpost}
                />
              );
            })
          ) : (
            <Heading color="gray.400" textAlign="center">
              Follow some user to see there feed
            </Heading>
          )}
        </Flex>
        <FollowingSuggestions />
      </Flex>
    </>
  );
};
