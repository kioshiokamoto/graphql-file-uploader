import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateRandomString(length) {
	var result = [];
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
	}
	return result.join('');
}

const typeDefs = gql`
	scalar FileUpload
	type File {
		url: String!
	}
	

	type Query {
		hello: String!
	}

	type Mutation {
		uploadFile(file: FileUpload!): File!
	}
`;

const resolvers = {
	FileUpload: graphqlUploadExpress,
	Query: {
		hello: () => `Hello Apollo!`,
	},
	Mutation: {
		uploadFile: async (parent, { file }) => {
			//console.log(file)
			const { createReadStream, filename } = await file.promise;
			//console.log(createReadStream , filename)
			const stream = createReadStream();

			 const { ext } = path.parse(filename);
			const randomName = generateRandomString(12) + ext;
			//const randomName = generateRandomString(12) ;

			const pathName = path.join(__dirname, `/public/images/${randomName}`);
			
			await stream.pipe(fs.createWriteStream(pathName));

			return {
				url: `http://localhost:4000/images/${randomName}`,
			};
		},
	},
};

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const server = new ApolloServer({
	uploads:false,
	typeDefs,
	resolvers,
});
app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 1 }));
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
	console.log(`🚀 Server ready at http://localhost:4000`);
});
