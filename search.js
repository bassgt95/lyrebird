import Sequelize from "sequelize";
import { db, Song } from './db';

Song.findAll({
    where: {
        timeSignature,
        [op.gte] :{
            similarity: 0.85
        }
    }
});