use anchor_lang::error_code;

#[error_code]
pub enum ErrorCode {
    #[msg("The program has already been initialized")]
    ProgramAlreadyInitialized,
    #[msg("This account has already been initialized")]
    AccountAlreadyInitialized,
    #[msg("This function does not take any additional parameters")]
    FunctionDoesNotTakeAdditionalParams,
    #[msg("This function requires additional parameters")]
    FunctionRequiresAdditionalParams,
    #[msg("The input provided is out of bounds of the available domain")]
    OutOfDomainBounds,
    #[msg("The accounts for this function call were not loaded")]
    MissingDataAccount,
    #[msg("Not all of the data for this function account has been loaded")]
    IncompleteDataLoading,
    #[msg("Data at the requested index has not been populated")]
    EmptyData,
    #[msg("Missing function implementation")]
    MissingImplementation,
    #[msg("Invalid index for X value")]
    InvalidIndex,
    #[msg("Invalid Y value for X value")]
    InvalidValue,
    #[msg("The data at this index has already been loaded")]
    DataAtIndexAlreadyLoaded,
}

#[macro_export]
macro_rules! print_error {
    ($err:expr) => {{
        || {
            let error_code: ErrorCode = $err;
            msg!("{:?} thrown at {}:{}", error_code, file!(), line!());
            $err
        }
    }};
}

#[macro_export]
macro_rules! math_error {
    () => {{
        || {
            let error_code = $crate::error::ErrorCode::MathError;
            msg!("Error {} thrown at {}:{}", error_code, file!(), line!());
            error_code
        }
    }};
}
