import { CoinUtil } from "@hlf-core/common";
import { ValidateUtil } from "./ValidateUtil";

export class RegExpUtil {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static DATE_TIME_PATTERN = '[0-9]{14}';
    public static ETH_ADDRESS_PATTERN = '0x[0-9a-f]{40}';
    public static TRANSACTION_HASH_PATTERN = '[0-9a-fA-F]{64}';

    public static NICKNAME_PATTERN = '[0-9a-z_]{1,22}';
    public static NICKNAME_REG_EXP = new RegExp(`^${RegExpUtil.NICKNAME_PATTERN}$`);
    public static NICKNAME_UID_REG_EXP = new RegExp(`^nickname/${RegExpUtil.NICKNAME_PATTERN}$`);

    public static COIN_UID_REG_EXP = CoinUtil.UID_REG_EXP;
    public static COIN_COIN_ID_REG_EXP = CoinUtil.COIN_ID_REG_EXP;
    public static COIN_OWNER_UID_REG_EXP = CoinUtil.OWNER_UID_REG_EXP;
    public static COIN_OBJECT_UID_REG_EXP = new RegExp('^[A-Za-z0-9\/_]*$');

    public static USER_UID_REG_EXP = new RegExp(`^user/${RegExpUtil.ETH_ADDRESS_PATTERN}$`);
    public static AUCTION_UID_REG_EXP = new RegExp(`^auction/${RegExpUtil.NICKNAME_PATTERN}/${RegExpUtil.DATE_TIME_PATTERN}$`);

    public static ETH_ADDRESS_REG_EXP = new RegExp(`^${RegExpUtil.ETH_ADDRESS_PATTERN}$`);
    public static DESCRIPTION_REG_EXP = new RegExp(`^.{${ValidateUtil.DESCRIPTION_MIN_LENGTH},${ValidateUtil.DESCRIPTION_MAX_LENGTH}}`);
}
