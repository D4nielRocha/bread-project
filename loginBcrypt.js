// const hashPassword = async(password) => {
//     const salt = await bcrypt.genSalt(12);
//     const hash = await bcrypt.hash(password, salt);
//     console.log(salt);
//     console.log(hash);
// }


// const hashPassword = async(password) => {
//     const hash = await bcrypt.hash(password, 12);
//     // console.log(salt);
//     console.log(hash);
// }

//  const login = async (password, hashedPw) => {
//     const result = await bcrypt.compare(password, hashedPw);
//     if(result){
//         console.log('Logged you in successfully', result);
//     } else {
//         console.log('Incorrect password!!');
//     }
//  }

// // hashPassword('daniel88');
// login('daniell88', "$2b$12$S9Na4SaqlUIgJBpoqg1L.eUlLDmyEPFyrOQV7MWGZbTqUmRMy7fxe")