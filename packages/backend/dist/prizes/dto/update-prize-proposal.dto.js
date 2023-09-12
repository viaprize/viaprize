"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePrizeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_prize_proposal_dto_1 = require("./create-prize-proposal.dto");
class UpdatePrizeDto extends (0, swagger_1.PartialType)(create_prize_proposal_dto_1.CreatePrizeProposalDto) {
}
exports.UpdatePrizeDto = UpdatePrizeDto;
//# sourceMappingURL=update-prize-proposal.dto.js.map