----------------------------------------------------------------------------------
-- Company: 
-- Engineer: 
-- 
-- Create Date:    18:00:52 05/19/2024 
-- Design Name: 
-- Module Name:    encoder_priority - Behavioral 
-- Project Name: 
-- Target Devices: 
-- Tool versions: 
-- Description: 
--
-- Dependencies: 
--
-- Revision: 
-- Revision 0.01 - File Created
-- Additional Comments: 
--
----------------------------------------------------------------------------------
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.STD_LOGIC_ARITH.ALL;
use IEEE.STD_LOGIC_UNSIGNED.ALL;

entity Encoder_ALU_Priority is
    Port (
        I      : in  STD_LOGIC_VECTOR (3 downto 0);
        A      : out STD_LOGIC_VECTOR (1 downto 0);
        ALU_out: out STD_LOGIC_VECTOR (3 downto 0)
    );
end Encoder_ALU_Priority;

architecture Behavioral of Encoder_ALU_Priority is
    signal ALU_result : STD_LOGIC_VECTOR(3 downto 0);
begin
    process(I)
    begin
        case I is
            when "0000" =>
                A <= "00";
                ALU_result <= (others => '0');  -- Aucune opération de l'UAL
            when "1000" | "1111" | "1001" | "1011" | "1010" | "1101" | "1100" | "1110"=>
                A <= "11";
                ALU_result <= "1000" + I;  -- Addition avec I
            when "0100" | "0101" | "0110" | "0111" =>
                A <= "10";
                ALU_result <= "0100" + I;  -- Addition avec I
            when "0010" | "0011" =>
                A <= "01";
                ALU_result <= "0010" + I;  -- Addition avec I
            when others =>
                A <= "00"; -- Valeurs inattendues
                ALU_result <= (others => '0');  -- Aucune opération de l'UAL
        end case;
    end process;
    
    ALU_out <= ALU_result;
end Behavioral;
