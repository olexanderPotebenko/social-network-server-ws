let axios = require('axios');

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8080/',
});

module.exports = {
    userApi: {
        getUsers(options) {

            let {id, token, page_size, page_current} = options;
            return instance.get(`users/?page=${page_current}&count=${page_size}`,
                {
                    headers:  id ? { authorize: token, id: id }: {} ,
                }).then(res => res.data);
        },
    },
    profileApi: {
        getProfile (options) {

            let {id, token, user_id} = options;
            return instance.get(`profile/${user_id}`,
                {
                    headers:  id ? { authorize: token, id: id }: {} ,
                }).then(res => res.data);
        },

        /*
    getAvatar (options) {

        let {user_id} = options;
        return instance.get(`profile/${user_id}/avatar`)
            .then(res => {
                debugger;
                return res.data 
            });
    },
    */

        // posts
        getPosts ({user_id, count, page}) {
            return instance.get(`profile/${user_id}/posts/?page=${page}&count=&{count}`)
                .then(res => res.data);
        },
        getLikersPost ({user_id, post_id}) {
            return instance.get(`likers/?user_id=${user_id}&post_id=${post_id}`)
                .then(res => res.data);
        },
        createPost ({id, token, post}) {
            return instance.post(`profile/${id}/posts/`,
                post,
                { headers: {authorize: token, id, 'Content-Type': 'form/multipart'}, }
            )
                .then( res =>  res.data );
        },

        likedPost ({id, token, user_id, post_id}) {
            return instance.post(`profile/${user_id}/posts/${post_id}/like`,
                {},
                { headers: {authorize: token, id}, })
                .then(res => res.data);
        },
        /*
            id: this.props.auth.id,
            user_id: this.props.profile.id,
            token: this.props.auth.token,
            post_id: this.props.post.id,
            */
        // delete
        deletePost ({id, token, post_id}) {
            return instance.delete(`profile/${id}/posts/${post_id}`,
                { headers: {authorize: token, id}, })
                .then(res => {
                    console.log(res);
                    return {post: {id: post_id}, result_code: 0};
                },
                    rej => {
                        console.log(rej);
                        return {result_code: 1};
                    } 
                )
        },
        // put 
        updateProfile ({id, token, formData}) {
            return instance.put(`profile/${id}/update`,
                formData,
                { headers: {authorize: token, id}, })
                .then(res => {
                    return res.data;
                });
        },

    },

    authApi: {
        signIn ({email, password}) {

            return instance.post(`signin`, {password, email} )
                .then( res => {
                    return res.data });

        },
        signUp ({email, password, first_name, last_name}) {

            return instance.post(`signup`, 
                {email, password, first_name, last_name})
                .then( res => res.data );
        },
    },

    followApi: {
        follow ({token, id, user_id}) {

            return instance.post(`follow/${user_id}`, {},
                { headers: {authorize: token, id} }
            ).then( res => res.data );
        },
        unfollow ({token, id, user_id}) {

            return instance.delete(`follow/${user_id}/`, 
                { headers: {authorize: token, id} }
            ).then( res => res.data );
        },

    },

    messageApi: {
        getDialogs (options) {
            let {id, token} = options
            return instance.get(`messages/${id}/`,
                {
                    headers: {authorize: token, id}
                }).then(res => res.data);
        },

    },
}

